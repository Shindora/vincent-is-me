export type Tag = "data" | "ai";

export const principles = [
  {
    title: "Data and AI are one system",
    text: "A model is only as good as the data it reads and the data that checks it. I design the two together, and the checks live in code.",
    mark: "both",
  },
  {
    title: "Start from the outcome",
    text: "Decide what has to change for the business and how it will be measured, then pick the data and the model.",
    mark: "ink",
  },
  {
    title: "Measure before building",
    text: "redcrab’s benchmark existed before the broker. unbyte sized its market from a day of mainnet before the decoder.",
    mark: "data",
  },
  {
    title: "Write down when to stop",
    text: "Every bet gets a kill criterion before it starts, so ending it is a decision and not a drift.",
    mark: "ai",
  },
] as const;

export const LANG_COLORS: Record<string, string> = {
  Rust: "#dea584",
  Python: "#3572a5",
  Scala: "#c22d40",
};

// Newest or most important first; the home page shows the first four.
export const projects: {
  name: string;
  url: string;
  tags: Tag[];
  lang: string;
  meta: string;
  summary: string;
}[] = [
  {
    name: "redcrab",
    url: "https://github.com/Shindora/redcrab",
    tags: ["data"],
    lang: "Rust",
    meta: "author · pre-alpha",
    summary:
      "A streaming broker that speaks the Kafka wire protocol, written from scratch in Rust. One binary, no JVM, Raft replication per partition.",
  },
  {
    name: "llmdup",
    url: "https://github.com/Shindora/llmdup",
    tags: ["ai"],
    lang: "Python",
    meta: "author · llm-d 1.0",
    summary:
      "From a Kubernetes cluster to a working llm-d endpoint in one command. A k9s-style TUI, a JSON CLI and an MCP server over one core.",
  },
  {
    name: "unbyte",
    url: "",
    tags: ["data", "ai"],
    lang: "Rust",
    meta: "author · private",
    summary:
      "Decodes Solana programs into data people and agents can read, including closed ones with no IDL. A model proposes layouts; a validator decides.",
  },
  {
    name: "qod",
    url: "https://github.com/starlake-ai/qod",
    tags: ["data", "ai"],
    lang: "Scala",
    meta: "contributor · starlake-ai",
    summary:
      "An agent-safe SQL gateway for DuckDB and DuckLake: row and column security inside the engine, with Flight SQL, MCP and native DuckDB.",
  },
];

export const posts: {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  tags: Tag[];
  blurb: string;
  summary: string;
}[] = [
  {
    slug: "agent-harness",
    title: "How to build and evaluate an agent harness",
    date: "2026-11-20",
    readingTime: "5 min",
    tags: ["ai"],
    blurb: "The model decides what to do next. The harness decides what it sees, what it can touch and when it stops.",
    summary:
      "The model decides what to do next. The harness decides what the model sees, what it can touch and when it stops. Most of the quality you get from an agent comes from the second part.",
  },
  {
    slug: "unbyte-architecture",
    title: "AI proposes, data decides: how unbyte decodes closed Solana programs",
    date: "2026-11-20",
    readingTime: "5 min",
    tags: ["data", "ai"],
    blurb: "A model infers layouts nobody published, a strict validator decides what to keep, and no model sits on the answer path.",
    summary:
      "A language model infers the layout of programs that publish nothing, a strict validator decides what to keep, and no model ever sits on the answer path.",
  },
];

export const publications = [
  {
    year: 2022,
    title: "Design Intelligent Educational Chatbot for Information Retrieval based on Integrated Knowledge Bases",
    venue: "IAENG International Journal of Computer Science 49(2)",
    doi: "",
  },
  {
    year: 2021,
    title: "An Empirical Study for Vietnamese Constituency Parsing with Pre-training",
    venue: "RIVF International Conference on Computing and Communication Technologies",
    doi: "10.1109/RIVF51545.2021.9642143",
  },
  {
    year: 2021,
    title: "Ontology-based Integration of Knowledge Base for Building an Intelligent Searching Chatbot",
    venue: "Sensors and Materials 33, p. 3101",
    doi: "10.18494/SAM.2021.3264",
  },
  {
    year: 2020,
    title: "Build a search engine for the knowledge of the course about Introduction to Programming based on ontology Rela-model",
    venue: "12th International Conference on Knowledge and Systems Engineering (KSE)",
    doi: "10.1109/KSE50997.2020.9287775",
  },
];

export const pagePaths = ["/", "/projects", "/writing", ...posts.map((p) => `/writing/${p.slug}`), "/visitors"];
