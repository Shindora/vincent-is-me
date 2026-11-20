import Image from "next/image";
import { LlmdupFlow } from "../diagrams";
import { Post, postMetadata } from "../post";

export const metadata = postMetadata("llmdup");

const SECTIONS = [
  ["why", "Why it exists"],
  ["try", "Two minutes, no GPU"],
  ["cluster", "Then your cluster"],
  ["frontends", "One core, three front ends"],
  ["safety", "Safe by construction"],
  ["matters", "Why it matters"],
  ["start", "Try it"],
] as const;

export default function Llmdup() {
  return (
    <Post slug="llmdup" sections={SECTIONS}>
      <div className="tldr">
        <p className="tldr-label mono">In short</p>
        <ul>
          <li>llm-d 1.0 ships every well-lit path as a recipe. llmdup runs those recipes for you, instead of you copying commands out of a README.</li>
          <li>
            <code>llmdup local up --yes</code> brings up the llm-d router, the Inference Extension and two simulated model
            servers on a laptop in about two minutes, with no GPU.
          </li>
          <li>The same plan runs on your cluster, from a k9s-style UI, a JSON CLI, or an MCP server that agents can use safely.</li>
        </ul>
      </div>

      <h2 id="why">Why it exists</h2>
      <p>
        llm-d is a Kubernetes-native way to serve LLMs, with prefix-cache aware routing, prefill/decode disaggregation and
        latency-based routing. The hard part is the first hour: clone the right release, read a support table, export a
        dozen variables, copy the blocks that apply, and hope the cleanup was complete.
      </p>
      <p>
        llm-d 1.0 made that machine-readable: each guide is a <code>guide.yaml</code> with variables, a support matrix and
        ordered prerequisite, deploy, verify and cleanup steps. llmdup drives that recipe. It writes no install commands
        of its own, so what it runs is exactly what llm-d’s own guides say.
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>By hand</th>
            <th>llmdup</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Variables</td>
            <td>Read the support table, export a dozen</td>
            <td>Detects accelerator, provider and model; validates every value</td>
          </tr>
          <tr>
            <td>Cluster-wide changes</td>
            <td>Easy to miss</td>
            <td>Flagged, shown with real values, run only after you confirm</td>
          </tr>
          <tr>
            <td>Knowing it worked</td>
            <td>Watch pods, craft a curl</td>
            <td>Waits for ready pods, sends the guide’s own smoke test</td>
          </tr>
          <tr>
            <td>Teardown</td>
            <td>Find the cleanup block, hope</td>
            <td>Runs the guide’s cleanup, then checks nothing is left</td>
          </tr>
        </tbody>
      </table>

      <h2 id="try">Try it in two minutes, no GPU</h2>
      <pre>
        <code>{LOCAL}</code>
      </pre>
      <p>
        That is a real llm-d stack on a laptop kind cluster: the router, the Gateway API Inference Extension and two
        simulated model servers, answering <code>/v1/completions</code> through the router. You need Python 3.14 (uv
        installs it), <code>kubectl</code>, <code>helm</code> and <code>kind</code> with Docker or Podman.
      </p>
      <figure>
        <Image
          src="/llmdup/guides.png"
          alt="llmdup terminal UI listing the llm-d guides, with support for the detected accelerator"
          width={1998}
          height={1252}
          sizes="(max-width: 960px) 100vw, 700px"
        />
        <figcaption>The guides view, with support shown for the detected accelerator.</figcaption>
      </figure>

      <h2 id="cluster">Then run the same plan on your cluster</h2>
      <pre>
        <code>{CLUSTER}</code>
      </pre>
      <p>
        Anything you leave out comes from detection first, then from the guide’s defaults. A value the guide does not
        allow exits with code 2 and lists the allowed ones. All 27 guides in llm-d v1.0.0 that have a{" "}
        <code>guide.yaml</code> load and plan for <code>up</code>, <code>test</code> and <code>down</code>.
      </p>
      <figure>
        <Image
          src="/llmdup/plan.png"
          alt="llmdup plan view: variables with their source, ordered steps with tags, and the exact command of the selected step"
          width={1998}
          height={1252}
          sizes="(max-width: 960px) 100vw, 700px"
        />
        <figcaption>The plan view: every variable with its source, every step with its exact command.</figcaption>
      </figure>

      <h2 id="frontends">One core, three front ends</h2>
      <LlmdupFlow />
      <ul>
        <li>
          <strong>Terminal UI for people.</strong> Run <code>llmdup</code> with no arguments. k9s keys; plan, deploy with
          a live log, doctor with copyable fixes, and stacks where you can test, tail logs, read metrics, port-forward or
          tear down.
        </li>
        <li>
          <strong>CLI for scripts.</strong> With <code>--yes</code> and <code>--json</code>, every command prints exactly
          one JSON document and returns a stable exit code: 1 names the failed step and its last 40 log lines, 2 is a bad
          value, 3 a blocking preflight check, 4 a confirmation that is needed.
        </li>
        <li>
          <strong>MCP server for agents.</strong> <code>claude mcp add llmdup -- llmdup mcp</code> gives an agent eight
          tools, from <code>list_guides</code> to <code>down</code>. <code>up</code> and <code>down</code> are two-step:
          without <code>confirm: true</code> they change nothing and return the plan, the target context and the exact
          commands, and the confirmed call must name that same context.
        </li>
      </ul>

      <h2 id="safety">Safe by construction</h2>
      <ul>
        <li>The kube context is resolved once and pinned for every command, so switching context in another terminal cannot redirect a deploy.</li>
        <li>Cluster-scoped steps and every delete need explicit confirmation that shows the real context, namespace and commands.</li>
        <li><code>HF_TOKEN</code> and other secrets come only from the environment and are redacted from logs, JSON, state and the screen.</li>
        <li>Teardown verifies the namespace, Helm releases and pods afterwards. Anything it cannot verify counts as left behind.</li>
      </ul>

      <h2 id="matters">Why it matters</h2>
      <ul>
        <li>
          Trying llm-d costs two minutes on a laptop instead of a GPU budget, so a team can learn the router and the
          Inference Extension before it buys capacity.
        </li>
        <li>The plan you tried locally is the plan you deploy, so there is no gap between the demo and the cluster.</li>
        <li>Verified teardown means a forgotten experiment does not keep holding GPUs.</li>
        <li>Agents can stand up and tear down inference, with a person approving every cluster-wide change.</li>
      </ul>
      <p>
        Not in 0.1: creating cloud clusters, choosing a configuration from a workload or SLA, benchmarks, several guides
        in one namespace, and upgrades between llm-d versions.
      </p>

      <h2 id="start">Try it, and tell me what breaks</h2>
      <pre>
        <code>{INSTALL}</code>
      </pre>
      <p>
        The code is on <a href="https://github.com/Shindora/llmdup">GitHub</a> under Apache-2.0, like llm-d, and the
        package is on <a href="https://pypi.org/project/llmdup/">PyPI</a>. If you run it on a cluster, open an issue with
        your accelerator, provider and the guide you tried, whether it worked or not. That is the fastest way to make the
        next release better.
      </p>
    </Post>
  );
}

const LOCAL = `uv tool install llmdup        # or: pip install llmdup
llmdup local up --yes         # kind + llm-d router + simulated models
llmdup status                 # pods and the endpoint
llmdup test                   # rerun the guide's smoke test
llmdup down --yes             # cleanup, then check nothing is left
llmdup local down --yes       # delete the kind cluster`;

const CLUSTER = `# preflight: tools, GPUs, CRDs, capacity, HF_TOKEN
llmdup doctor optimized-baseline --context my-cluster

# the ordered steps, cluster-wide ones flagged
llmdup plan optimized-baseline --accelerator gpu

# print the exact script, then run it: deploy, wait for pods, smoke test
llmdup up optimized-baseline --context my-cluster --dry-run
llmdup up optimized-baseline --context my-cluster --yes

llmdup down --context my-cluster --namespace llm-d-optimized-baseline --yes`;

const INSTALL = `uv tool install llmdup
llmdup local up --yes`;
