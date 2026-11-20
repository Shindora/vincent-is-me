import { Post, postMetadata } from "../post";

export const metadata = postMetadata("agent-harness");

const SECTIONS = [
  ["harness", "What a harness is"],
  ["build", "Build it in this order"],
  ["evaluate", "Evaluate tasks, not prompts"],
  ["measure", "Reliability, cost and noise"],
  ["failures", "Read the failures"],
  ["checklist", "Checklist"],
] as const;

export default function AgentHarness() {
  return (
    <Post slug="agent-harness" sections={SECTIONS}>
      <div className="tldr">
        <p className="tldr-label mono">In short</p>
        <ul>
          <li>The harness decides most of an agent’s quality: what the model sees, what it can touch, and when it stops.</li>
          <li>Start with one loop, a few sharp tools, a trace file and a recorded stop reason. Add the rest when a measured failure asks for it.</li>
          <li>Evaluate on tasks with a check in code. Run each one k times and report pass^k and cost per successful task next to the pass rate.</li>
        </ul>
      </div>

      <h2 id="harness">What a harness is</h2>
      <p>
        An agent is a loop: build a context, ask the model for the next step, run the tools it asks for, append the
        results, repeat until something says stop. The model is one call in that loop. Everything else is the harness:
        the system prompt, the tools and the shape of their output, what gets dropped when the context fills up, what
        needs permission, and when the run ends.
      </p>
      <p>
        Swap the model under a good harness and you get a slightly better or worse agent. Swap the harness and you can
        get a different product.
      </p>

      <h2 id="build">Build it in this order</h2>
      <p>
        <strong>1. The loop.</strong> It should fit on one screen. Trace every turn to JSONL from day one, and record why
        the run stopped: “done” and “out of turns” can end with the same message.
      </p>
      <pre>
        <code>{LOOP}</code>
      </pre>
      <p>
        <strong>2. Tools.</strong> The model knows them only by name, description, schema and output, so design them like
        an API for a reader who cannot ask questions.
      </p>
      <ul>
        <li>Few tools, one job each. Tools that overlap make the model guess.</li>
        <li>Errors go back as text and say what to try next. The loop never crashes on a tool failure.</li>
        <li>Truncate long output and say so. A silent cut looks like the whole answer.</li>
      </ul>
      <pre>
        <code>{EXECUTE}</code>
      </pre>
      <p>
        <strong>3. Context.</strong> Large results go to a file; the model gets the path and a summary. When you compact,
        keep the task and the last few turns verbatim and summarise the middle. Log tokens per turn.
      </p>
      <p>
        <strong>4. Safety and stopping.</strong> Run in a container or a throwaway worktree, without credentials it does
        not need. Writes outside the workspace go through a permission check. Stop when the model says it is done, at a
        turn limit, at a token or time budget, or when the same tool call repeats three times.
      </p>

      <h2 id="evaluate">Evaluate tasks, not prompts</h2>
      <p>
        Reading a few transcripts and tweaking the prompt until they look better is not evaluation. You need tasks and a
        number. A task is a starting state, an instruction and a check written in code: the tests pass, the query returns
        these rows, nothing else changed.
      </p>
      <pre>
        <code>{TASK}</code>
      </pre>
      <ul>
        <li>Take tasks from real failures. Forty from real use beat a thousand generated ones.</li>
        <li>
          Treat the set as a dataset: versioned, with the source of each task, and a held-out slice you never tune on.
        </li>
        <li>
          Check the final state, not the transcript. Where code cannot check the outcome, use a model as judge with a
          rubric, and trust it only after it agrees with your own labels on thirty or so examples.
        </li>
      </ul>

      <h2 id="measure">Measure reliability, cost and noise</h2>
      <p>Agents are not deterministic. Run every task k times (five is a good start) in a fresh workspace and report:</p>
      <ul>
        <li>
          <strong>pass@1</strong>: the average success over all runs.
        </li>
        <li>
          <strong>pass^k</strong>: the share of tasks that passed every run. This is what users and unattended jobs feel.
          At 80% per run, pass^5 is about 33%.
        </li>
        <li>
          <strong>cost per successful task</strong>: the agent’s unit economics, and the number to compare with what the
          work costs today.
        </li>
      </ul>
      <pre>
        <code>{SCORE}</code>
      </pre>
      <p>
        Weight tasks by how often they happen and what a failure costs; a rare task that corrupts data matters more than
        a common one that wastes a minute. And mind the noise: with 40 tasks near 60%, the standard error is about 8
        points (√(0.6 × 0.4 / 40)), so a 5-point gain from one run means nothing. Compare the same tasks with the same k,
        task by task.
      </p>

      <h2 id="failures">Read the failures</h2>
      <p>
        The number says whether you improved; the traces say why you did not. Put every failed run in a bucket
        (confusing tool output, lost instruction, stopped early, looped, flaky environment, wrong task), fix the biggest
        bucket and rerun. Most fixes land in the harness, not the prompt: a clearer error, a truncation notice, a tool
        split in two. Fix flaky tasks too; they poison every comparison.
      </p>

      <h2 id="checklist">Checklist</h2>
      <ul>
        <li>One loop, few tools, every turn traced, the stop reason recorded.</li>
        <li>Errors that say what to try next; truncation that says it truncated.</li>
        <li>Large results in files, and a context budget.</li>
        <li>A sandbox, a permission check on writes, more than one way to stop.</li>
        <li>30 to 50 tasks from real failures, checks in code, a held-out slice.</li>
        <li>k runs per task; pass@1, pass^k and cost per successful task.</li>
        <li>Read the failures after every run and fix the biggest bucket first.</li>
      </ul>
    </Post>
  );
}

const LOOP = `def run_agent(
    task: str,
    model: Model,
    tools: Toolbox,
    trace: Path,
    max_turns: int = 30,
) -> Run:
    """Run one task until the model stops calling tools or hits the turn limit."""
    run = Run(messages=[{"role": "user", "content": task}])
    with trace.open("a") as log:
        for turn in range(1, max_turns + 1):
            reply = model.complete(run.messages, tools=tools.specs())
            run.messages.append(reply.message)
            entry = {"turn": turn, "message": reply.message, "usage": reply.usage}
            log.write(json.dumps(entry) + "\\n")
            if not reply.tool_calls:
                return run.finish("done", turns=turn)
            for call in reply.tool_calls:
                run.add_tool_result(call.id, tools.execute(call))
    return run.finish("max_turns", turns=max_turns)`;

const EXECUTE = `def execute(self, call: ToolCall) -> str:
    """Run a tool call and return text for the model. Never raises."""
    tool = self.tools.get(call.name)
    if tool is None:
        return f"error: no tool {call.name!r}. Available: {', '.join(self.tools)}"
    try:
        output = tool.run(**call.args)
    except Exception as e:  # noqa: BLE001 - the model has to see every failure
        return f"error: {call.name} failed: {e}. Expected: {tool.schema}"
    if len(output) <= LIMIT:
        return output
    note = f"[truncated: showed {LIMIT:,} of {len(output):,} characters]"
    return f"{output[:LIMIT]}\\n{note}"`;

const TASK = `@dataclass(frozen=True)
class Task:
    id: str
    instruction: str
    setup: Callable[[Path], None]
    check: Callable[[Path], bool]`;

const SCORE = `def score(results: dict[str, list[bool]]) -> tuple[float, float]:
    """Return (pass@1, pass^k) from each task's run outcomes."""
    rates = [sum(runs) / len(runs) for runs in results.values()]
    pass_at_1 = sum(rates) / len(rates)
    pass_all = sum(all(runs) for runs in results.values()) / len(results)
    return pass_at_1, pass_all`;
