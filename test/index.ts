import { run } from "./lib/test.js"
import "./tasks.test.js"
import "./settings.test.js"
import "./task-dialog.test.js"
import "./calendar.test.js"
import "./calendar-view.test.js"
import "./notes.test.js"
import "./notes-view.test.js"

run().then(report)

function report(results: Awaited<ReturnType<typeof run>>) {
  const failed = results.filter(result => result.error)
  const report = document.getElementById("report")
  let suite = ""
  for (const result of results) {
    if (result.suite !== suite) {
      suite = result.suite
      const heading = document.createElement("h2")
      heading.textContent = suite
      report.append(heading)
    }
    const line = document.createElement("p")
    line.className = result.error ? "fail" : "pass"
    line.textContent = `${result.error ? "✗" : "✓"} ${result.name}${result.error ? ` — ${result.error}` : ""}`
    report.append(line)
  }
  const summary = document.getElementById("summary")
  summary.className = failed.length ? "fail" : "pass"
  summary.textContent = `${results.length - failed.length} of ${results.length} tests passed`
  const machine = document.createElement("pre")
  machine.id = "results"
  machine.hidden = true
  machine.textContent = results.map(result => result.error ? `FAIL ${result.suite} › ${result.name}: ${result.error}` : `PASS ${result.suite} › ${result.name}`).join("\n") + `\nRESULT ${results.length - failed.length}/${results.length}`
  document.body.append(machine)
}
