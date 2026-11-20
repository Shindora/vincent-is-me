import { Post, postMetadata } from "../post";

export const metadata = postMetadata("agent-harness");

const SECTIONS = [
  ["harness", "The harness is everything else"],
  ["loop", "Start with the loop"],
  ["tools", "Tools"],
  ["context", "Budget the context"],
  ["safety", "Sandbox and stopping"],
  ["tasks", "Evaluate tasks, not prompts"],
  ["runs", "Run more than once"],
  ["grading", "Grade outcomes"],
  ["noise", "Cost and noise"],
  ["outcome", "Tie it to the outcome"],
  ["failures", "Read the failures"],
  ["checklist", "Checklist"],
] as const;

export default function AgentHarness() {
  return (
    <Post slug="agent-harness" sections={SECTIONS}>
      <h2 id="harness">The harness is everything except the model</h2>
      <p>
        An agent is a loop. Build a context, ask the model for the next step, run the tool calls it asks for, append
        the results, and go again until something says stop. The model is one function call inside that loop.
        Everything around it is the harness: the system prompt, the tool definitions, how tool output is shaped, what
        gets dropped when the context fills up, which actions need permission, and the conditions that end the run.
      </p>
      <p>
        Swap the model under a good harness and you usually get a slightly better or worse agent. Swap the harness
        under a good model and you can get a different product. So I treat the harness like any other piece of
        software: small, tested and measured. This post is the order I build one in, and how I tell whether a change
        made it better.
      </p>

      <h2 id="loop">Start with the loop</h2>
      <p>
        The first version should fit on one screen: one loop, a handful of tools, a turn limit and a trace file.
        Everything else is added when a measured failure asks for it.
      </p>
      <pre>
        <code>{LOOP}</code>
      </pre>
      <p>
        <code>Model</code> and <code>Toolbox</code> are whatever wraps your provider’s API and your tools; the shape
        matters more than the names. Two details matter from day one. Every turn goes to a JSONL trace, because you
        cannot evaluate what you did not record. And the run records <em>why</em> it stopped, because “finished” and
        “ran out of turns” can end with the same final message.
      </p>
      <p>
        Tool failures go back to the model as text. The loop never crashes because a tool raised; it tells the model
        what happened and lets it try something else.
      </p>
      <pre>
        <code>{TOOLBOX}</code>
      </pre>

      <h2 id="tools">Tools are an interface for a reader that cannot ask questions</h2>
      <p>
        The model only knows your tools through their names, descriptions, schemas and outputs. Design them the way
        you would design an API for someone who will never read the source.
      </p>
      <ul>
        <li>Keep the set small, and give each tool one clear job. Two tools that overlap make the model guess.</li>
        <li>The description is a prompt. Say when to use the tool, when not to, and what it returns.</li>
        <li>
          Truncate long output and say that you did: <code>showed 200 of 4,118 lines, pass offset to read more</code>
          . A silent cut looks like the whole answer.
        </li>
        <li>
          Write errors that say what to do next. <code>No file src/main.rs. Did you mean src/bin/main.rs?</code>{" "}
          fixes the next turn; a stack trace burns it.
        </li>
        <li>Return stable identifiers, not positions that shift when something else changes.</li>
        <li>Split read and write tools, and make anything destructive take an explicit argument.</li>
      </ul>

      <h2 id="context">Budget the context</h2>
      <p>
        The context window is the agent’s working memory, and it fills faster than you expect. Long tool output is
        the usual cause. Three rules hold up well:
      </p>
      <ul>
        <li>Large results go to a file. The model gets the path, the size and a short summary.</li>
        <li>
          Keep the task statement and the last few turns verbatim. When you have to compact, summarise the middle:
          decisions made, files touched, what was tried and failed.
        </li>
        <li>Count tokens per turn and log them. You will want that number when you evaluate.</li>
      </ul>

      <h2 id="safety">Sandbox, permissions and stop conditions</h2>
      <p>
        Run the agent somewhere it can break things safely: a container or a throwaway worktree, no credentials it
        does not need, the network off unless the task needs it. Reads can be free. Writes outside the workspace and
        anything that cannot be undone go through a permission check that a person or a policy answers.
      </p>
      <p>Give the run more than one way to end, and record which one fired:</p>
      <ul>
        <li>the model says it is done;</li>
        <li>a turn limit;</li>
        <li>a token or cost limit, and a wall-clock limit;</li>
        <li>a no-progress check, for example the same tool call with the same arguments three times in a row.</li>
      </ul>

      <h2 id="tasks">Evaluate tasks, not prompts</h2>
      <p>
        You cannot improve a harness by reading a few transcripts and adjusting the prompt until they look better.
        You need a set of tasks and a number.
      </p>
      <p>
        A task has three parts: a starting state, an instruction and a check. The starting state is a repository at
        a commit, a database fixture, a cluster from a config file. The check is code: the tests pass, the query
        returns these rows, the function exists and nothing else changed.
      </p>
      <pre>
        <code>{TASK}</code>
      </pre>
      <p>
        The best tasks come from real failures. Every time the agent gets something wrong in normal use, turn it into
        a task. Forty tasks taken from real use tell you more than a thousand generated ones. Keep a slice of them
        aside and do not read their transcripts while you tune, or you will tune to them.
      </p>
      <p>
        Treat the task set as a dataset, because it is one. Version it, record where each task came from and when, and
        keep the labels for why past runs failed. The traces are data too: store them where you can query them, so
        “which tool errors went up after Tuesday’s change” is a query and not an afternoon of reading. Evaluation is
        where data work and AI work stop being separate jobs.
      </p>

      <h2 id="runs">Run each task more than once</h2>
      <p>
        Agents are not deterministic, even at temperature zero, once tools, timing and the environment are involved.
        Run every task k times, five is a reasonable start, each time in a fresh workspace, and report two numbers:
      </p>
      <ul>
        <li>
          <strong>pass@1</strong>, the average success over all runs. A task that passes three times out of five
          counts as 0.6.
        </li>
        <li>
          <strong>pass^k</strong>, the share of tasks that passed every one of their k runs. This is the reliability
          number, the one that tells you whether you can leave the agent alone.
        </li>
      </ul>
      <p>
        They diverge more than people expect. If every run passes independently with probability 0.8, pass@1 is 80%
        and pass^5 is 0.8<sup>5</sup>, about 33%. Users feel the second number.
      </p>
      <pre>
        <code>{SUITE}</code>
      </pre>

      <h2 id="grading">Grade outcomes, then judge what code cannot check</h2>
      <p>
        Check the final state rather than the transcript. The agent can take a path you did not expect and still be
        right, and a transcript check punishes it for that.
      </p>
      <p>
        Some outcomes cannot be checked in code: was the summary accurate, does the commit message describe the
        change. For those, use a model as a judge with a written rubric, and calibrate it first. Label thirty or so
        outputs yourself, run the judge on the same ones, and trust it only where it agrees with you. Check the
        agreement again whenever you change the judge model or the rubric.
      </p>

      <h2 id="noise">Measure cost, and know your noise</h2>
      <p>
        Log turns, tokens and wall-clock time for every run, next to pass rate. A change that adds two points and
        doubles the tokens is a trade, not a win. Plot pass rate against cost per task and look for changes that move
        you up without moving you right.
      </p>
      <p>
        Small task sets are noisy. With 40 tasks and a pass rate near 60%, the standard error is about eight points:
        √(0.6 × 0.4 / 40) ≈ 0.077. Going from 60% to 65% on one run of the suite is not evidence of anything. Run the
        same tasks with the same k before and after a change, compare task by task, and read the ones that flipped.
      </p>

      <h2 id="outcome">Tie the number to the outcome</h2>
      <p>
        A pass rate is a proxy. Nobody in the business wants a pass rate; they want a ticket closed, a pipeline fixed, an
        analyst’s afternoon back. Before the task set grows, write down which outcome the agent is for, and make the
        suite reflect it:
      </p>
      <ul>
        <li>
          Weight tasks by how often they happen in real use and by what a failure costs. A rare task that corrupts data
          matters more than a common one that wastes a minute.
        </li>
        <li>
          Report cost per successful task, not cost per run. It is the agent’s unit economics, and the number to put
          next to what the same work costs today.
        </li>
        <li>Use pass^k for anything that runs unattended. A person can retry a flaky assistant; a nightly job cannot.</li>
      </ul>
      <p>
        When a harness change moves the pass rate but none of these, it was an engineering exercise. That is allowed,
        but call it that.
      </p>

      <h2 id="failures">Read the failures, fix the biggest bucket</h2>
      <p>
        The number tells you whether you got better. The traces tell you why you did not. After each run, read the
        failed transcripts and put each one in a bucket: confusing tool output, instruction lost from context,
        stopped too early, looped, environment flake, wrong task.
      </p>
      <p>
        Fix the biggest bucket, rerun, repeat. Most fixes land in the harness rather than the prompt: a clearer error
        message, an output that now says it was truncated, one tool split into two. A surprising share of failures
        turn out to be the task or the environment. Fix those too. Pin dependencies, cut the network, seed anything
        random. A flaky task makes every comparison worse.
      </p>

      <h2 id="checklist">A checklist</h2>
      <ul>
        <li>One loop, few tools, every turn traced to JSONL, the stop reason recorded.</li>
        <li>Tool output truncated with a note; errors that say what to try next.</li>
        <li>A context budget, with large results moved to files.</li>
        <li>A sandbox, a permission check on writes, and more than one way to stop.</li>
        <li>30 to 50 tasks from real failures, each with a setup and a check in code, and a held-out slice.</li>
        <li>Tasks and traces kept as versioned data you can query.</li>
        <li>k runs per task; pass@1 and pass^k, with tokens and time next to them.</li>
        <li>Cost per successful task, next to the outcome the agent exists to move.</li>
        <li>Read the failures after every run, and fix the biggest bucket first.</li>
      </ul>
    </Post>
  );
}

const LOOP = `from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

MAX_TURNS = 30


@dataclass
class Run:
    messages: list[dict[str, object]] = field(default_factory=list)
    turns: int = 0
    stop_reason: str = ""


def run_agent(task: str, model: Model, tools: Toolbox, trace: Path) -> Run:
    """Run one task until the model stops calling tools or the turn limit is hit."""
    run = Run(messages=[{"role": "user", "content": task}])
    with trace.open("a") as log:
        while run.turns < MAX_TURNS:
            run.turns += 1
            reply = model.complete(run.messages, tools=tools.specs())
            run.messages.append(reply.message)
            log.write(json.dumps({"turn": run.turns, "message": reply.message, "usage": reply.usage}) + "\\n")
            if not reply.tool_calls:
                run.stop_reason = "done"
                return run
            for call in reply.tool_calls:
                result = tools.execute(call)
                run.messages.append({"role": "tool", "tool_call_id": call.id, "content": result})
                log.write(json.dumps({"turn": run.turns, "tool": call.name, "args": call.args, "result": result}) + "\\n")
    run.stop_reason = "max_turns"
    return run`;

const TOOLBOX = `@dataclass(frozen=True)
class Toolbox:
    tools: dict[str, Tool]

    def execute(self, call: ToolCall) -> str:
        """Run a tool call and return text for the model. Never raises."""
        tool = self.tools.get(call.name)
        if tool is None:
            return f"error: no tool named {call.name!r}. Available: {', '.join(self.tools)}"
        try:
            output = tool.run(**call.args)
        except TypeError as e:
            return f"error: bad arguments for {call.name}: {e}. Schema: {tool.schema}"
        except Exception as e:  # noqa: BLE001 - the model has to see every failure
            return f"error: {call.name} failed: {e}"
        return truncate(output, limit=8_000)


def truncate(text: str, limit: int) -> str:
    """Cut long output and tell the model how much it is missing."""
    if len(text) <= limit:
        return text
    return f"{text[:limit]}\\n[truncated: showed {limit:,} of {len(text):,} characters]"`;

const TASK = `@dataclass(frozen=True)
class Task:
    id: str
    instruction: str
    setup: Callable[[Path], None]
    check: Callable[[Path], bool]`;

const SUITE = `def run_suite(tasks: list[Task], agent: Agent, k: int = 5) -> dict[str, list[bool]]:
    """Run every task k times, each in a fresh workspace."""
    results: dict[str, list[bool]] = {}
    for task in tasks:
        for attempt in range(k):
            with tempfile.TemporaryDirectory() as tmp:
                workspace = Path(tmp)
                task.setup(workspace)
                agent.run(task.instruction, workspace, trace=TRACES / f"{task.id}-{attempt}.jsonl")
                results.setdefault(task.id, []).append(task.check(workspace))
    return results


def score(results: dict[str, list[bool]]) -> tuple[float, float]:
    """Return (pass@1, pass^k) from per-task run outcomes."""
    pass_at_1 = sum(sum(runs) / len(runs) for runs in results.values()) / len(results)
    pass_all = sum(all(runs) for runs in results.values()) / len(results)
    return pass_at_1, pass_all`;
