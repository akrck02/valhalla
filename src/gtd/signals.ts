import { uuidv4 } from "./crypto.js";

export type signalHandler = (data: any) => Promise<void>;
const buffer: Map<string, signalHandler[]> = new Map();

/**
 * Set a new signal
 */
export function setSignal(): string {
  const id = uuidv4();
  buffer.set(id, []);
  return id;
}

/**
 * Connect a function to a signal
 * @param id The signal id
 * @param handler The signal handler function
 */
export function connectToSignal(id: string, handler: signalHandler) {
  if (false == buffer.has(id)) {
    console.error(`Error connecting: The signal ${id} does not exist.`);
    return;
  }

  buffer.get(id).push(handler);
}

/**
 * Disconnect every handler of a signal
 * @param id The signal id
 */
export function disconnectSignal(id: string) {
  if (false == buffer.has(id)) {
    console.error(`Error disconnecting: The signal ${id} does not exist.`);
    return;
  }

  buffer.set(id, []);
}

/**
 * Emit a signal with the given data
 */
export async function emitSignal(id: string, data: any = undefined) {
  if (false == buffer.has(id)) return;

  const targets = buffer.get(id);
  await Promise.all(targets.map((target) => target(data)));
}
