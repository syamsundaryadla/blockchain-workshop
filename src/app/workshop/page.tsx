import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import {
  WORKSHOP_SCHEDULE,
  WORKSHOP_SETTINGS,
} from "@/content/beginner-workshop";
import {
  PRACTICAL_STEPS,
  PRACTICAL_TESTS,
  PROJECT_EXCERPTS,
} from "@/content/practical";
export default function WorkshopKitPage() {
  return (
    <main className="workshop-kit">
      <header className="kit-navigation">
        <Link href="/" className="text-button">
          <ArrowLeft size={15} />
          Presentation
        </Link>
        <Link href="/workshop/instructor" className="text-button">
          Instructor notes <ArrowUpRight size={14} />
        </Link>
      </header>
      <section className="kit-intro">
        <span className="eyebrow">
          Student kit / Hyperledger Fabric / your build at 3
        </span>
        <h1>
          Make a transfer.
          <br />
          Explain every rule.
        </h1>
        <p>
          Learn the concepts in the morning. Follow the real application after
          lunch. Complete three small JavaScript TODOs, then deploy and test
          during the final hour.
        </p>
        <div className="kit-actions">
          <a
            className="studio-button primary"
            href="/workshop/campus-credits-kit.zip"
            download
          >
            <Download size={16} />
            Download project kit
          </a>
          <a
            className="studio-button secondary"
            href="/workshop/fabric-installation-guide.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Installation PDF <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
      <section className="kit-downloads" aria-label="Workshop resources">
        <a href="/workshop/student-handout.md" download>
          <span className="eyebrow">Follow the steps</span>
          <strong>Student handout</strong>
          <span>Commands, checkpoints and expected balances.</span>
        </a>
        <a href="/workshop/transfer-rules.starter.js" download>
          <span className="eyebrow">Your exercise</span>
          <strong>Starter rule</strong>
          <span>The same starter is included in the full kit.</span>
        </a>
        <a href="/workshop/transfer-rules.solution.js" download>
          <span className="eyebrow">Recovery / comparison</span>
          <strong>Completed rule</strong>
          <span>
            Use inside the kit; this file alone is not a deployed contract.
          </span>
        </a>
        <Link href="/mini-project">
          <span className="eyebrow">Predict first</span>
          <strong>Browser rehearsal</strong>
          <span>A labeled simulation of balances and permissions.</span>
        </Link>
      </section>
      <section className="kit-settings">
        <h2>Your prepared environment</h2>
        <dl>
          {[
            ["Platform", WORKSHOP_SETTINGS.environment],
            ["Node.js", WORKSHOP_SETTINGS.node],
            ["Fabric", WORKSHOP_SETTINGS.fabric],
            ["Fabric CA", WORKSHOP_SETTINGS.fabricCA],
            ["Channel", WORKSHOP_SETTINGS.channel],
          ].map(([a, b]) => (
            <div key={a}>
              <dt>{a}</dt>
              <dd>{b}</dd>
            </div>
          ))}
        </dl>
        <p>
          Install before workshop day in Ubuntu on WSL 2. Each laptop or pair
          runs a separate local network. These are demo credits, with no real
          money or wallet extension.
        </p>
      </section>
      <details className="kit-schedule">
        <summary>Day schedule · 10:00–16:00</summary>
        <div className="kit-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Session</th>
                <th>Your activity</th>
              </tr>
            </thead>
            <tbody>
              {WORKSHOP_SCHEDULE.map(([time, title, activity]) => (
                <tr key={time}>
                  <td>{time}</td>
                  <td>{title}</td>
                  <td>{activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <section className="kit-practical">
        <div className="kit-section-heading">
          <span className="eyebrow">3:00–4:00 / build, test, explain</span>
          <h2>Your numbered practical</h2>
        </div>
        <p className="kit-status">
          The kit provides network scripts, identities, the backend, and the
          HTML/CSS interface. You complete amount validation, the funds check,
          and the two resulting balances.
        </p>
        <ol className="practical-steps">
          {PRACTICAL_STEPS.map((step, i) => (
            <li id={`step-${i + 1}`} key={step.title}>
              <span className="practical-step-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.action}</p>
                {step.command && (
                  <pre>
                    <code>{step.command}</code>
                  </pre>
                )}
                <div className="expected-result">
                  <strong>Expected result</strong>
                  <p>{step.expected}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="kit-excerpts">
        <span className="eyebrow">Compare after trying</span>
        <h2>The three rule sections</h2>
        <p>
          These excerpts belong inside prepareTransfer in the project kit. The
          identity checks and ledger writes are supplied separately.
        </p>
        {Object.entries(PROJECT_EXCERPTS).map(([name, code]) => (
          <details key={name}>
            <summary>
              {name === "amount"
                ? "1. Validate the amount"
                : name === "funds"
                  ? "2. Check available funds"
                  : "3. Calculate both balances"}
            </summary>
            <pre>
              <code>{code}</code>
            </pre>
          </details>
        ))}
      </section>
      <section className="kit-tests">
        <h2>Prove the rules.</h2>
        <p>
          Read both balances after every rejected request. Start at 100 / 50;
          transfer 20, then 10 back.
        </p>
        <div className="kit-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Try this</th>
                <th>Expected result</th>
              </tr>
            </thead>
            <tbody>
              {PRACTICAL_TESTS.map(([name, action, result]) => (
                <tr key={name}>
                  <th>{name}</th>
                  <td>{action}</td>
                  <td>{result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="kit-limits">
        <h2>What did you prove?</h2>
        <p>
          The contract checks the actual signing identity, enforces transfer
          rules and preserves the total. The UI confirms success after a valid
          Fabric commit. The Alice/Bob selector uses prepared local demo
          credentials; it is not production login.
        </p>
        <p>
          A trusted single operator may be better served by a database with
          permissions and an audit log.
        </p>
      </section>
      <footer className="kit-navigation">
        <Link href="/?slide=39" className="text-button">
          Return to your build hour →
        </Link>
        <a
          className="text-button"
          href="https://hyperledger-fabric.readthedocs.io/en/release-2.5/write_first_app.html"
          target="_blank"
          rel="noreferrer"
        >
          Official Fabric application guide <ArrowUpRight size={14} />
        </a>
      </footer>
    </main>
  );
}
