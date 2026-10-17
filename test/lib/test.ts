/**
 * A small test runner that runs in the browser, so GTD needs no node.
 * describe / it / expect, and mock functions that remember their calls.
 */

type TestCase = { suite: string, name: string, body: () => void | Promise<void> }
export type TestResult = { suite: string, name: string, error?: string }

const cases: TestCase[] = []
const cleanups: (() => void)[] = []
let currentSuite = ""

/** Group the tests of a module */
export function describe(name: string, body: () => void) {
  const previous = currentSuite
  currentSuite = previous ? `${previous} › ${name}` : name
  body()
  currentSuite = previous
}

/** Declare a test */
export function it(name: string, body: () => void | Promise<void>) {
  cases.push({ suite: currentSuite, name, body })
}

/** Run something after the current test, even if it fails */
export function afterThis(cleanup: () => void) {
  cleanups.push(cleanup)
}

/** Run every declared test, in order */
export async function run(): Promise<TestResult[]> {
  const results: TestResult[] = []
  for (const test of cases) {
    const result: TestResult = { suite: test.suite, name: test.name }
    try {
      await test.body()
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error)
    }
    while (cleanups.length) cleanups.pop()()
    results.push(result)
  }
  return results
}

/** A function that records how it was called */
export type Mock<T extends (...args: any[]) => any> = T & { calls: Parameters<T>[] }

export function mock<T extends (...args: any[]) => any>(implementation?: T): Mock<T> {
  const fn = function (this: unknown, ...args: any[]) {
    fn.calls.push(args as Parameters<T>)
    return implementation?.apply(this, args)
  } as Mock<T>
  fn.calls = []
  return fn
}

/** Replace a property of an object until the end of the test */
export function replace<O extends object, K extends keyof O>(object: O, key: K, value: O[K]) {
  const own = Object.getOwnPropertyDescriptor(object, key)
  Object.defineProperty(object, key, { value, configurable: true, writable: true })
  afterThis(() => own ? Object.defineProperty(object, key, own) : delete object[key])
}

/** Replace fetch with files kept in memory, until the end of the test */
export function fakeFetch(files: { [path: string]: string } = {}) {
  const fetch = mock(async (path: string, _options?: RequestInit) =>
    path in files ? new Response(files[path]) : new Response("not found", { status: 404 }))
  replace(window, "fetch", fetch as any)
  return fetch
}

/** Silence a console method until the end of the test, and count its calls */
export function quiet(method: "error" | "warn" | "debug") {
  const fn = mock(() => {})
  replace(console, method, fn as any)
  return fn
}

function show(value: unknown): string {
  try { return JSON.stringify(value) ?? String(value) } catch { return String(value) }
}

function equal(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a != "object" || typeof b != "object" || null == a || null == b) return false
  const keysA = Object.keys(a), keysB = Object.keys(b)
  return keysA.length == keysB.length && keysA.every(key => equal(a[key], b[key]))
}

/** Assertions */
export function expect<T>(actual: T) {
  const fail = (message: string) => { throw new Error(message) }
  return {
    toBe(expected: T) {
      if (!Object.is(actual, expected)) fail(`expected ${show(actual)} to be ${show(expected)}`)
    },
    toEqual(expected: unknown) {
      if (!equal(actual, expected)) fail(`expected ${show(actual)} to equal ${show(expected)}`)
    },
    toBeTruthy() {
      if (!actual) fail(`expected ${show(actual)} to be truthy`)
    },
    toBeFalsy() {
      if (actual) fail(`expected ${show(actual)} to be falsy`)
    },
    toContain(part: string) {
      if (!String(actual).includes(part)) fail(`expected ${show(actual)} to contain ${show(part)}`)
    },
    toMatch(pattern: RegExp) {
      if (!pattern.test(String(actual))) fail(`expected ${show(actual)} to match ${pattern}`)
    },
    toHaveBeenCalledTimes(times: number) {
      const calls = (actual as Mock<any>).calls.length
      if (calls != times) fail(`expected ${times} calls, got ${calls}`)
    },
    toHaveBeenCalledWith(...args: unknown[]) {
      if (!(actual as Mock<any>).calls.some(call => equal(call, args)))
        fail(`expected a call with ${show(args)}, got ${show((actual as Mock<any>).calls)}`)
    },
  }
}
