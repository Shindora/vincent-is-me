import Link from "next/link";
import { Post, postMetadata } from "../post";

export const metadata = postMetadata("unbyte-architecture");

const SECTIONS = [
  ["problem", "The problem"],
  ["outcome", "Outcome first, data picks"],
  ["principle", "No model on the answer path"],
  ["tiers", "Cheapest tier first"],
  ["loop", "AI proposes, data decides"],
  ["history", "Decode with the IDL of the day"],
  ["honest", "Never silently wrong"],
  ["drift", "A registry that checks itself"],
  ["deploy", "Batch here, serving there"],
  ["lessons", "What carries over"],
] as const;

export default function UnbyteArchitecture() {
  return (
    <Post slug="unbyte-architecture" sections={SECTIONS}>
      <h2 id="problem">The problem</h2>
      <p>
        A Solana transaction is a list of instructions, and each instruction is a program id, some accounts and a blob
        of bytes. To say what happened you need the program’s interface description, its IDL. Many programs publish one.
        Many do not, and the ones that do often let it fall behind the code that runs.
      </p>
      <p>Two measurements framed the project:</p>
      <ul>
        <li>
          On 2026-10-12, <strong>28.4%</strong> of app instruction volume went through programs with no IDL and no
          verified source: 666 programs, out of 455.8M top-level instructions that day, leaving out Vote and Compute
          Budget.
        </li>
        <li>
          Programs that do publish an IDL are not safe either. Across the 49 busiest of them, only <strong>75.9%</strong>{" "}
          of volume decoded cleanly with the program’s own on-chain IDL (2026-10-14).
        </li>
      </ul>
      <p>
        unbyte is my attempt to close both gaps: decode closed programs from public data, and repair the published IDLs
        that have gone stale. This post is about how it is put together, because the architecture is most of the answer.
      </p>

      <h2 id="outcome">Start from the outcome, let the data pick the targets</h2>
      <p>
        Before any decoder existed, the project had one number to move: the share of app instruction volume decoded with
        a verified quality score. Not programs supported, not fields named. Volume, because volume is what the people
        reading these transactions care about: wallets, analysts, and agents that sign on their own.
      </p>
      <p>
        That choice let the data decide where the AI should go. Volume is concentrated: the top 10 programs carry 81.1%
        of it, the top 100 carry 96.5%. Most of the closed programs in the top 100 turned out to be operator
        infrastructure, such as quoting bots, oracles and single-wallet programs that nobody else needs to read. Only
        three were public trading routers, programs that users sign without being able to read what they sign. Those
        three became the targets, and the operator programs became an explicit non-goal.
      </p>
      <p>
        The model never chose what to work on. A query over a day of mainnet did, and each product direction has a
        written kill criterion that says when to stop.
      </p>

      <h2 id="principle">No model on the answer path</h2>
      <p>
        The first decision shaped everything else. A language model does the expensive inference work, but it never
        answers a decode request. Every decoded instruction comes from a validated IDL in a registry, so an answer is
        deterministic, reproducible and fast enough to serve in well under a second.
      </p>
      <p>
        The model is a production cost of the registry: one run per program version, about a dollar each ($0.64 to
        $1.26 per run so far). When a program upgrades, the registry pays again. When a thousand agents ask about the
        same program, nobody does.
      </p>

      <h2 id="tiers">Cheapest tier first</h2>
      <p>Each program goes through the cheapest method that works:</p>
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Case</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="mono">0</td>
            <td>IDL on chain</td>
            <td>Read the Anchor IDL account or the Program Metadata IDL, then validate it on real traffic</td>
          </tr>
          <tr>
            <td className="mono">1</td>
            <td>Verified build</td>
            <td>Find the source through the verified-build registry and generate an IDL from it</td>
          </tr>
          <tr>
            <td className="mono">2</td>
            <td>Closed Anchor and forks</td>
            <td>
              Brute-force Anchor discriminators, borrow a known IDL whose discriminator matches, and keep it only if it
              consumes the data exactly
            </td>
          </tr>
          <tr>
            <td className="mono">3</td>
            <td>Closed native</td>
            <td>Infer the layout from many transactions: the loop described next</td>
          </tr>
        </tbody>
      </table>
      <p>
        Tier 2 is where the “consumes exactly” rule earns its place. One closed router, term9, reuses Jupiter’s{" "}
        <code>route</code> discriminator with a different argument layout. Borrowing Jupiter’s IDL would have produced
        confident nonsense. The exact-fit check rejects it, and the inferred layout fits 493 of 494 unseen instructions.
      </p>

      <h2 id="loop">AI proposes, data decides</h2>
      <p>
        For closed programs, a deterministic probe goes first. It groups instructions by tag byte, finds length prefixes,
        side flags, PDA bumps and the ids of the programs they call, and lines up 64-bit integers against the arguments
        of those inner calls, the events and the token balance changes. Then a model gets that evidence and proposes
        layouts and field meanings.
      </p>
      <p>The model’s proposal is only a hypothesis. A validator decides, and it is strict:</p>
      <table>
        <thead>
          <tr>
            <th>Gate</th>
            <th>What it rejects</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Exact fit</td>
            <td>Layouts that leave bytes over or run out of bytes</td>
          </tr>
          <tr>
            <td>Balance check</td>
            <td>Amounts that do not match the token balance changes of the transaction</td>
          </tr>
          <tr>
            <td>Holds on 95% of at least 20 samples</td>
            <td>Meanings that fit a few lucky transactions</td>
          </tr>
          <tr>
            <td>Negative control</td>
            <td>Meanings that also “hold” when the evidence comes from another transaction or another field</td>
          </tr>
          <tr>
            <td>Held-out traffic</td>
            <td>Layouts tuned to the transactions they were inferred from</td>
          </tr>
        </tbody>
      </table>
      <p>
        The negative control is the one I would keep if I could only keep one. A check like “this field equals the amount
        that left the user’s token account” is easy to satisfy by accident when amounts are round or repeated. If the
        same check also passes against a different transaction’s balances, it is not evidence of anything.
      </p>
      <p>
        To find out whether the loop could be trusted, I gave it a blind exam: infer FLASHX, a closed router whose layout
        I had already worked out by hand, without showing it the answer. It recovered all 9 known fields with verified
        meanings, and solved a 33-byte swap shape that my hand-built IDL had missed. When FLASHX’s traffic later shifted,
        the blind loop proposed the hand-made layout byte for byte (283 of 283) for $0.66.
      </p>

      <h2 id="history">Decode with the IDL of the day</h2>
      <p>
        Programs change. pump and pump_amm rewrote their IDLs 15 to 16 times in about fourteen months. Decoding an old
        transaction with today’s IDL is a quiet way to be wrong, so unbyte rebuilds every past IDL version from the IDL
        account’s own history and versions them by slot.
      </p>
      <p>
        A transaction is decoded with the first version that fits its data exactly: the one live at its slot, then the
        one before (IDLs are sometimes published ahead of the deploy), then the one after. On 1,148 historical
        instructions and events across those eras, today’s IDL decoded 50% cleanly. The IDL by slot decoded 98%.
      </p>

      <h2 id="honest">Never silently wrong</h2>
      <p>
        Data that does not fit exactly is reported, not stretched. Every instruction, inner calls included, comes back
        with a status: <code>decoded</code> (with any trailing bytes counted), <code>event</code>,{" "}
        <code>borrowed</code> or <code>borrow_failed</code>, <code>no_idl</code>, <code>idl_unusable</code>, or{" "}
        <code>error</code>. It also says where its IDL came from: the curated registry, the chain, or a historical
        version together with the slot of that version.
      </p>
      <p>
        That sounds like bookkeeping, and it is. It is also what makes the system measurable. The quality numbers in this
        post are counts of those statuses over real traffic, nothing more clever than that.
      </p>
      <p>
        It paid off early. A FLASHX swap carried a route byte the entry did not know. It failed to decode instead of
        decoding wrongly, and the byte turned out to be a PDA bump forwarded by one of the route steps.
      </p>

      <h2 id="drift">A registry that checks itself</h2>
      <p>
        Every curated entry records what it was validated against: the deploy slot, a fingerprint of the on-chain IDL it
        repairs, and its clean-decode rate. Two commands keep it honest. <code>idl watch</code> flags redeploys and IDL
        changes. <code>registry validate</code> re-measures an entry on recent transactions and records whether it still
        meets its bar. The first run of the watcher found a new pump instruction, about 3% of pump calls, that the
        published IDL did not have.
      </p>
      <p>
        Drift is not hypothetical. On 2026-10-14, FLASHX decoded 98.8% of a full day’s calls byte for byte. On
        2026-10-15 that fell to 93.6%, because its traffic moved to instructions and route payloads that had been rare the
        day before. The update the next morning decoded all 3,882,890 held-out calls of that day byte for byte. That
        figure is dated on purpose: a router’s traffic can shift again any day, and the registry is built to notice when
        it does.
      </p>

      <h2 id="deploy">Batch here, serving there</h2>
      <pre>
        <code>{DIAGRAM}</code>
      </pre>
      <p>
        The work splits cleanly into batch and serving. Batch work (sampling a day of mainnet from BigQuery’s public
        Solana dataset, running the model, validating, scoring) runs in a CLI, locally or in CI. It is slow, bursty and
        happy to take minutes.
      </p>
      <p>
        Serving runs on Cloudflare. A Worker answers decode requests and the MCP endpoint, IDLs and test vectors live in
        R2, registry metadata in D1, and a cron trigger feeds a queue that re-validates programs when they upgrade.
      </p>
      <p>
        The one hard constraint is that the decoding core compiles to WebAssembly. It does no I/O at all, which is what
        lets the same code run in the Worker, in the CLI and, later, inside a wallet. Anything that needs native
        dependencies stays in the inference crate, which never ships to the edge.
      </p>

      <h2 id="lessons">What carries over</h2>
      <p>
        The pattern is not specific to Solana. Whenever a model is good at proposing and bad at being right, put it in
        front of a checker that can say no:
      </p>
      <ul>
        <li>Pick one number the business cares about, and let the data choose where the model goes.</li>
        <li>Keep the model off the request path. Pay for inference once and serve the validated result.</li>
        <li>Make the validator strict, with exact fits and negative controls, and always test on held-out data.</li>
        <li>Report what you could not decode. An honest “unknown” is worth more than a confident guess.</li>
        <li>Version everything by time, and assume that what you validated yesterday may not hold today.</li>
      </ul>
      <p>
        It is the same idea as the evaluation half of{" "}
        <Link href="/writing/agent-harness">how to build and evaluate an agent harness</Link>: the model proposes, a check
        written in code decides, and you keep measuring after you ship.
      </p>
      <p className="note">Figures are from unbyte’s dated measurement reports; dates are given next to each one.</p>
    </Post>
  );
}

const DIAGRAM = ` batch: CLI, local or CI                  serving: Cloudflare
 ─────────────────────────                ───────────────────────────
 BigQuery samples ──┐                     Worker + wasm decoder
 RPC transactions ──┼─► tiers 0–3         MCP endpoint
 Gemini proposes ───┘   validator  ─────► R2  IDLs, test vectors
                        decides           D1  registry metadata
                                          Cron + Queues  upgrade watch
                                                   │
                                                   ▼
                                    agents · wallets · explorers`;
