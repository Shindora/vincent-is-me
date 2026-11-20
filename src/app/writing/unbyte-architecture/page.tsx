import Link from "next/link";
import { UnbyteFlow } from "../diagrams";
import { Post, postMetadata } from "../post";

export const metadata = postMetadata("unbyte-architecture");

const SECTIONS = [
  ["problem", "The problem"],
  ["outcome", "Outcome first, data picks"],
  ["design", "The design in one picture"],
  ["validator", "AI proposes, data decides"],
  ["trust", "Versioned, honest, self-checking"],
  ["lessons", "What carries over"],
] as const;

export default function UnbyteArchitecture() {
  return (
    <Post slug="unbyte-architecture" sections={SECTIONS}>
      <div className="tldr">
        <p className="tldr-label mono">In short</p>
        <ul>
          <li>
            The model never answers a request. It builds the registry once per program version, for about a dollar, and
            answers come from validated IDLs: deterministic and fast.
          </li>
          <li>A strict validator decides what to keep: exact fit, balance checks, negative controls, held-out traffic.</li>
          <li>Data picked the targets. One business metric and a query over a day of mainnet chose what to decode.</li>
        </ul>
      </div>

      <h2 id="problem">The problem</h2>
      <p>
        A Solana instruction is a blob of bytes; to read it you need the program’s IDL. On 2026-10-12,{" "}
        <strong>28.4%</strong> of app instruction volume went through programs with no IDL and no verified source.
        Publishing one is no guarantee either: across the 49 busiest programs that do, only <strong>75.9%</strong> of
        volume decoded cleanly with their own on-chain IDL (2026-10-14).
      </p>

      <h2 id="outcome">Outcome first, data picks the targets</h2>
      <p>
        unbyte has one number to move: the share of app instruction volume decoded with a verified quality score. Volume
        is concentrated, with the top 10 programs carrying 81.1% of it and the top 100 carrying 96.5%. Most closed
        programs in the top 100 turned out to be operator infrastructure that nobody else needs to read. Only three were
        public trading routers, the programs users sign without being able to read what they sign. Those became the
        targets, and operator programs a non-goal. The model never chose what to work on.
      </p>

      <h2 id="design">The design in one picture</h2>
      <UnbyteFlow />
      <ul>
        <li>
          <strong>No model on the answer path.</strong> Inference is a build cost of the registry, paid once per program
          version ($0.64 to $1.26 per run so far). A thousand agents asking about the same program cost nothing extra.
        </li>
        <li>
          <strong>Batch and serving are separate.</strong> Sampling, inference and validation run in a CLI, locally or in
          CI. Serving runs on Cloudflare: a Worker, IDLs in R2, metadata in D1, and a cron and queue that re-validate a
          program when it upgrades.
        </li>
        <li>
          <strong>The core does no I/O</strong> and compiles to WebAssembly, so the same decoder runs in the Worker, the
          CLI and, later, a wallet.
        </li>
        <li>
          <strong>Cheapest tier first:</strong> the on-chain IDL, then verified source, then a borrowed IDL that must
          consume the data exactly, and inference only when nothing else works. The exact-fit rule matters: term9 reuses
          Jupiter’s discriminator with a different layout, so borrowing Jupiter’s IDL is rejected, and the inferred
          layout fits 493 of 494 unseen instructions.
        </li>
      </ul>

      <h2 id="validator">AI proposes, data decides</h2>
      <p>
        A deterministic probe gathers evidence: tag bytes, length prefixes, the arguments of inner calls, token balance
        changes. A model reads it and proposes layouts and field meanings. A validator decides:
      </p>
      <table>
        <thead>
          <tr>
            <th>Gate</th>
            <th>Rejects</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Exact fit</td>
            <td>Layouts that leave bytes over or run out of bytes</td>
          </tr>
          <tr>
            <td>Balance check</td>
            <td>Amounts that do not match the transaction’s token balance changes</td>
          </tr>
          <tr>
            <td>95% of at least 20 samples</td>
            <td>Meanings that fit a few lucky transactions</td>
          </tr>
          <tr>
            <td>Negative control</td>
            <td>Meanings that also “hold” on another transaction’s or another field’s evidence</td>
          </tr>
          <tr>
            <td>Held-out traffic</td>
            <td>Layouts tuned to the transactions they came from</td>
          </tr>
        </tbody>
      </table>
      <p>
        If you keep one gate, keep the negative control. Round or repeated amounts make a check like “equals what left
        the user’s account” easy to pass by accident; if it also passes on someone else’s transaction, it proves nothing.
      </p>
      <p>
        In a blind exam on FLASHX, a router I had already decoded by hand, the loop recovered all 9 known fields and a
        33-byte swap shape my hand-built IDL had missed. When FLASHX’s traffic later shifted, it re-derived the hand
        layout byte for byte (283 of 283) for $0.66.
      </p>

      <h2 id="trust">Versioned, honest, self-checking</h2>
      <ul>
        <li>
          <strong>Versioned.</strong> Every past IDL is rebuilt from chain history and picked by slot. On 1,148 historical
          pump and pump_amm instructions, today’s IDL decoded 50% cleanly; the IDL by slot decoded 98%.
        </li>
        <li>
          <strong>Honest.</strong> Each instruction comes back with a status (<code>decoded</code>, <code>borrowed</code>
          , <code>no_idl</code>, <code>error</code> and a few more) and the source of its IDL. Data that does not fit is
          reported, never stretched, and the same statuses are the quality metric.
        </li>
        <li>
          <strong>Self-checking.</strong> Each registry entry records the deploy and clean-decode rate it was validated
          at; <code>idl watch</code> flags changes and <code>registry validate</code> re-measures. When FLASHX’s traffic
          shifted on 2026-10-15, byte-exact decoding fell from 98.8% to 93.6%; the next morning’s update decoded all
          3,882,890 held-out calls of that day.
        </li>
      </ul>

      <h2 id="lessons">What carries over</h2>
      <ul>
        <li>Pick one number the business cares about, and let the data choose where the model goes.</li>
        <li>Keep the model off the request path. Pay for inference once and serve the validated result.</li>
        <li>Make the validator strict, with negative controls and held-out data.</li>
        <li>Report what you could not decode. An honest “unknown” beats a confident guess.</li>
        <li>Version everything by time; what you validated yesterday may not hold today.</li>
      </ul>
      <p>
        It is the evaluation half of <Link href="/writing/agent-harness">building an agent harness</Link>, applied to
        data: the model proposes, a check in code decides, and you keep measuring after you ship.
      </p>
      <p className="note">Figures come from unbyte’s dated measurement reports; each is given with its date.</p>
    </Post>
  );
}

