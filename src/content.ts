export const principles = [
  [
    "Data and AI are one system.",
    "A model is only as good as the data it reads and the data that checks it. I design the two together, and the checks live in code.",
  ],
  [
    "Start from the outcome.",
    "Decide what has to change for the business and how it will be measured, then pick the data and the model. A better benchmark score that moves nothing is not progress.",
  ],
  [
    "Measure before building.",
    "redcrab’s benchmark against Kafka existed before the broker did. unbyte sized its market from a full day of mainnet before the decoder was written. Then keep measuring after it ships.",
  ],
  ["Write down when to stop.", "Every bet gets a kill criterion before it starts, so ending it is a decision and not a drift."],
] as const;

export const projects = [
  {
    name: "redcrab",
    url: "https://github.com/Shindora/redcrab",
    summary:
      "A streaming broker that speaks the Apache Kafka wire protocol, written from scratch in Rust. One binary, no JVM, Raft replication per partition, tested against the stock Kafka command-line tools.",
    meta: ["Rust · author", "pre-alpha"],
  },
  {
    name: "llmdup",
    url: "https://github.com/Shindora/llmdup",
    summary:
      "From a Kubernetes cluster to a working llm-d endpoint in one command. A k9s-style terminal UI for people, a JSON CLI and an MCP server for scripts and agents, all driving the release’s own guides.",
    meta: ["Python · author", "llm-d 1.0"],
  },
  {
    name: "unbyte",
    url: "",
    summary:
      "Decodes Solana programs into structured data that people and agents can read, including closed programs that publish no IDL. An LLM proposes the layouts; a validator accepts them only when they decode real transactions.",
    meta: ["Rust · author", "private, pre-MVP"],
  },
  {
    name: "qod",
    url: "https://github.com/starlake-ai/qod",
    summary:
      "Quack on Demand, an SQL gateway in front of DuckDB and DuckLake. Multi-tenant pools, table, row and column security decided inside the engine, with Arrow Flight SQL, MCP and native DuckDB on the wire.",
    meta: ["Scala · contributor", "starlake-ai"],
  },
];

export const posts = [
  {
    slug: "agent-harness",
    title: "How to build and evaluate an agent harness",
    date: "2026-11-20",
    readingTime: "9 min read",
    summary:
      "The model decides what to do next. The harness decides what the model sees, what it can touch and when it stops. Most of the quality you get from an agent comes from the second part.",
  },
  {
    slug: "unbyte-architecture",
    title: "AI proposes, data decides: how unbyte decodes closed Solana programs",
    date: "2026-11-20",
    readingTime: "8 min read",
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

export const pagePaths = ["/", "/writing", ...posts.map((p) => `/writing/${p.slug}`), "/visitors"];
