type Tone = "plain" | "data" | "ai" | "ink";

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  tone = "plain",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  tone?: Tone;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const ink = tone === "ink" ? " dg-on-ink" : "";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={`dg-box dg-${tone}`} />
      <text x={cx} y={sub ? cy - 3 : cy + 5} textAnchor="middle" className={`dg-title${ink}`}>
        {title}
      </text>
      {sub && (
        <text x={cx} y={cy + 15} textAnchor="middle" className={`dg-sub${ink}`}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ d, id, dashed = false }: { d: string; id: string; dashed?: boolean }) {
  return <path d={d} className={`dg-line${dashed ? " dg-dash" : ""}`} markerEnd={`url(#${id})`} />;
}

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="dg-label">
      {children}
    </text>
  );
}

function Figure({
  id,
  label,
  caption,
  width = 680,
  height,
  children,
}: {
  id: string;
  label: string;
  caption: string;
  width?: number;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <figure className="diagram">
      <div className="diagram-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
          <defs>
            <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" className="dg-head" />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function QodGateway() {
  const id = "qod-gw";
  return (
    <Figure
      id={id}
      height={350}
      label="Clients connect to the qod gateway, which checks identity and grants and routes each statement to a DuckDB node over DuckLake storage"
      caption="Every client goes through the same door. Only result rows travel back; the base tables stay in your storage."
    >
      <Box x={0} y={20} w={150} h={46} title="BI tools" sub="Flight SQL, JDBC" />
      <Box x={0} y={78} w={150} h={46} title="DuckDB clients" sub="native quack" tone="data" />
      <Box x={0} y={136} w={150} h={46} title="HTTP tools" sub="read-only REST" />
      <Box x={0} y={194} w={150} h={46} title="AI agents" sub="MCP, scoped tokens" tone="ai" />
      {[43, 101, 159, 217].map((y) => (
        <Arrow key={y} id={id} d={`M150 ${y} H204`} />
      ))}
      <rect x={210} y={20} width={200} height={220} rx={12} className="dg-box dg-frame" />
      <Label x={310} y={44}>
        QOD GATEWAY
      </Label>
      <Box x={226} y={58} w={168} h={36} title="identity" />
      <Box x={226} y={104} w={168} h={36} title="grants, rows, columns" tone="data" />
      <Box x={226} y={150} w={168} h={36} title="route to a node" />
      <Label x={310} y={220}>
        EVERY STATEMENT AUDITED
      </Label>
      <Arrow id={id} d="M410 130 H464" />
      <rect x={470} y={20} width={210} height={220} rx={12} className="dg-box dg-frame" />
      <Label x={575} y={44}>
        DUCKDB NODE POOL
      </Label>
      <Box x={490} y={58} w={170} h={36} title="node · read" tone="data" />
      <Box x={490} y={104} w={170} h={36} title="node · read" tone="data" />
      <Box x={490} y={150} w={170} h={36} title="node · write" tone="data" />
      <Label x={575} y={220}>
        PLAN CHECKED ON EACH NODE
      </Label>
      <Arrow id={id} d="M575 240 V280" />
      <Box x={210} y={286} w={470} h={52} title="DuckLake catalog + Parquet in object storage" sub="the base tables never leave the server" />
    </Figure>
  );
}

export function QodBranches() {
  const id = "qod-br";
  return (
    <Figure
      id={id}
      height={200}
      label="An agent branches from main without copying data, writes on its branch, the diff is reviewed, and a person merges it into main as a tagged snapshot"
      caption="Agents never write to main. Their branch is reviewed as a diff, and a person merges it."
    >
      <Label x={20} y={40} anchor="start">
        MAIN
      </Label>
      <path d="M20 60 H660" className="dg-track dg-track-data" />
      <path d="M160 60 C 200 60, 190 140, 240 140 H440 C 500 140, 500 60, 560 60" className="dg-track dg-track-ai" />
      <circle cx={80} cy={60} r={7} className="dg-dot dg-dot-data" />
      <circle cx={160} cy={60} r={7} className="dg-dot dg-dot-data" />
      <circle cx={280} cy={140} r={7} className="dg-dot dg-dot-ai" />
      <circle cx={350} cy={140} r={7} className="dg-dot dg-dot-ai" />
      <circle cx={560} cy={60} r={10} className="dg-dot dg-dot-data dg-ring" />
      <Label x={175} y={100} anchor="start">
        CLONE, NO DATA COPIED
      </Label>
      <Label x={315} y={172}>
        THE AGENT WRITES HERE
      </Label>
      <Box x={404} y={120} w={112} h={40} title="review diff" />
      <Label x={560} y={32}>
        A PERSON MERGES · TAGGED
      </Label>
    </Figure>
  );
}

export function LlmdupFlow() {
  const id = "llmdup";
  return (
    <Figure
      id={id}
      height={300}
      label="The terminal UI, JSON CLI and MCP server share one core that reads llm-d guides and runs them against one pinned Kubernetes context"
      caption="Three front ends, one core. The steps come from llm-d's own guide.yaml; llmdup writes no install commands of its own."
    >
      <Box x={0} y={20} w={150} h={50} title="Terminal UI" sub="for people" />
      <Box x={0} y={84} w={150} h={50} title="JSON CLI" sub="for scripts" />
      <Box x={0} y={148} w={150} h={50} title="MCP server" sub="for agents" tone="ai" />
      {[45, 109, 173].map((y) => (
        <Arrow key={y} id={id} d={`M150 ${y} H196`} />
      ))}
      <rect x={200} y={20} width={220} height={178} rx={12} className="dg-box dg-frame" />
      <Label x={310} y={42}>
        ONE CORE
      </Label>
      <Box x={216} y={52} w={188} h={30} title="doctor" />
      <Box x={216} y={88} w={188} h={30} title="plan" />
      <Box x={216} y={124} w={188} h={30} title="run the steps" />
      <Box x={216} y={160} w={188} h={30} title="wait, then smoke test" tone="ai" />
      <Box x={470} y={20} w={210} h={56} title="llm-d v1.0 guide.yaml" sub="pinned, commit-checked" tone="data" />
      <Arrow id={id} d="M470 48 H426" />
      <Label x={448} y={40}>
        READS
      </Label>
      <Box x={470} y={142} w={210} h={56} title="Kubernetes" sub="one pinned context" />
      <Arrow id={id} d="M420 170 H466" />
      <Label x={443} y={162}>
        RUNS
      </Label>
      <Arrow id={id} d="M310 198 V234" />
      <Box x={200} y={240} w={480} h={46} title="state in the cluster" sub="status, test and down work from any machine" />
    </Figure>
  );
}

export function RedcrabCluster() {
  const id = "redcrab";
  const nodes = [0, 245, 490];
  const leader = [0, 1, 2];
  return (
    <Figure
      id={id}
      height={290}
      label="Kafka clients write to three redcrab nodes; each partition is a Raft group with its leader on one node and followers on the others"
      caption="Each partition is its own Raft group. A write is acknowledged once a majority, two of three nodes, has fsynced it."
    >
      <Box x={230} y={8} w={220} h={46} title="Kafka clients" sub="stock tools, acks=all" />
      <Arrow id={id} d="M290 54 C 290 80, 95 80, 95 104" />
      <Arrow id={id} d="M340 54 V104" />
      <Arrow id={id} d="M390 54 C 390 80, 585 80, 585 104" />
      {nodes.map((x, n) => (
        <g key={x}>
          <rect x={x} y={110} width={190} height={162} rx={12} className="dg-box dg-frame" />
          <Label x={x + 95} y={134}>
            {`NODE ${n + 1}`}
          </Label>
          {[0, 1, 2].map((p) => (
            <Box
              key={p}
              x={x + 16}
              y={148 + p * 38}
              w={158}
              h={28}
              title={`P${p} · ${leader[n] === p ? "leader" : "follower"}`}
              tone={leader[n] === p ? "data" : "plain"}
            />
          ))}
        </g>
      ))}
      <Arrow id={id} d="M174 162 H257" dashed />
      <Arrow id={id} d="M419 200 H502" dashed />
      <Label x={217} y={154}>
        RAFT
      </Label>
      <Label x={462} y={192}>
        RAFT
      </Label>
    </Figure>
  );
}

export function HarnessLoop() {
  const id = "loop";
  return (
    <Figure
      id={id}
      height={272}
      label="The agent loop: context goes to the model, the model asks for tool calls, tools run in a sandbox, results are appended to the context, until a stop condition fires"
      caption="The model is one box. Everything else is the harness, and every turn is written to a trace."
    >
      <Box x={235} y={8} w={210} h={46} title="Stop" sub="done, limit or no progress" tone="ink" />
      <Box x={20} y={100} w={170} h={56} title="Context" sub="task and history" />
      <Box x={255} y={100} w={170} h={56} title="Model" sub="picks the next step" tone="ai" />
      <Box x={490} y={100} w={170} h={56} title="Tools" sub="sandboxed, permissioned" tone="data" />
      <Box x={490} y={196} w={170} h={56} title="Results" sub="truncated, errors as text" />
      <Arrow id={id} d="M190 128 H251" />
      <Arrow id={id} d="M425 128 H486" />
      <Label x={456} y={120}>
        CALLS
      </Label>
      <Arrow id={id} d="M575 156 V192" />
      <Arrow id={id} d="M490 224 H60 V160" />
      <Label x={275} y={216}>
        APPEND
      </Label>
      <Arrow id={id} d="M340 100 V58" />
      <Label x={60} y={254} anchor="start">
        EVERY TURN → TRACE.JSONL
      </Label>
    </Figure>
  );
}

export function HarnessEval() {
  const id = "eval";
  return (
    <Figure
      id={id}
      height={160}
      label="Evaluation pipeline: tasks from real failures, k runs each in a fresh workspace, checks in code, and a report of pass@1, pass^k and cost, feeding back into fixes"
      caption="Measure with checks in code, then read the failures and fix the biggest bucket."
    >
      <Box x={0} y={30} w={146} h={58} title="Tasks" sub="from real failures" tone="data" />
      <Box x={178} y={30} w={146} h={58} title="k runs each" sub="fresh workspace" />
      <Box x={356} y={30} w={146} h={58} title="Checks in code" sub="the final state" />
      <Box x={534} y={30} w={146} h={58} title="Report" sub="pass@1, pass^k, cost" tone="ai" />
      <Arrow id={id} d="M146 59 H174" />
      <Arrow id={id} d="M324 59 H352" />
      <Arrow id={id} d="M502 59 H530" />
      <Arrow id={id} d="M607 88 V128 H73 V92" dashed />
      <Label x={340} y={146}>
        READ FAILURES, FIX THE BIGGEST BUCKET
      </Label>
    </Figure>
  );
}

export function UnbyteFlow() {
  const id = "unbyte";
  return (
    <Figure
      id={id}
      height={290}
      label="Batch: evidence, the model proposes, the validator decides, once per program version. Serving: a registry of validated IDLs feeds a decoder with no model in it"
      caption="The model works once per program version, in batch. Requests are answered from validated IDLs, with no model on the path."
    >
      <Label x={20} y={20} anchor="start">
        BATCH · ONCE PER VERSION
      </Label>
      <Label x={360} y={20} anchor="start">
        SERVING · EVERY REQUEST
      </Label>
      <path d="M335 8 V282" className="dg-line dg-dash" />
      <Box x={20} y={36} w={290} h={50} title="Evidence" sub="bytes, inner calls, balance changes" tone="data" />
      <Box x={20} y={120} w={290} h={50} title="Model proposes" sub="layouts and field meanings" tone="ai" />
      <Box x={20} y={204} w={290} h={50} title="Validator decides" sub="exact fit, controls, held-out" tone="ink" />
      <Arrow id={id} d="M165 86 V116" />
      <Arrow id={id} d="M165 170 V200" />
      <Box x={360} y={120} w={140} h={50} title="Registry" sub="versioned IDLs" tone="data" />
      <Arrow id={id} d="M310 229 H430 V174" />
      <Box x={540} y={120} w={140} h={50} title="Decoder" sub="no model here" />
      <Arrow id={id} d="M500 145 H536" />
      <Box x={540} y={210} w={140} h={50} title="Agents, wallets" sub="and explorers" />
      <Arrow id={id} d="M610 170 V206" />
      <Arrow id={id} d="M430 120 V61 H314" dashed />
      <Label x={442} y={92} anchor="start">
        UPGRADE → RE-VALIDATE
      </Label>
    </Figure>
  );
}
