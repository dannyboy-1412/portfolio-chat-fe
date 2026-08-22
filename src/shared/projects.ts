export type ProjectLink = {
  github?: string
  live?: string
}

export type Project = {
  slug: string
  name: string
  tagline: string
  description: string
  problem: string
  solution: string
  architecture: string
  decisions: string[]
  technologies: string[]
  impact: string[]
  learnings: string
  links: ProjectLink
  origin: "work" | "personal"
  relatedExperienceId?: string
  /** Draft content awaiting real write-up from Daniel — UI should flag this. */
  placeholder?: boolean
}

export const PROJECTS: Project[] = [
  {
    slug: "mesha",
    name: "Mesha",
    tagline: "AI Agent Builder",
    description:
      "Platform for building AI-powered accounting automation agents.",
    problem:
      "Accountants at Mesha's clients spent hours each month on manual closing summaries, unclear-transaction follow-ups, and invoice reconciliation — all repetitive, rules-plus-judgment work that AI could assist with under human review.",
    solution:
      "Built three production agents end to end — Closing, Clarification, and Invoice Recon — plus an AI Agent Builder that let the team assemble new workflows with human-in-the-loop review at every step instead of hand-coding each one.",
    architecture:
      "TypeScript/Express backend with a Next.js frontend, PostgreSQL and MongoDB for storage, and AWS for hosting. The Closing agent pulled P/L and Balance Sheet data from the Xero API and used structured LLM outputs to draft executive summaries emailed to clients. Invoice Recon matched Plaid/bank transactions against unpaid invoices using prompt-engineered matching against OpenAI and Anthropic models, with a review modal before reconciling.",
    decisions: [
      "Human-in-the-loop review at each agent step rather than fully autonomous actions, since the output touched client finances",
      "Structured LLM outputs for the Closing summaries to keep generation reliable and easy to template",
      "A general-purpose Agent Builder so new workflows could reuse the same building blocks instead of one-off services",
    ],
    technologies: [
      "TypeScript",
      "Express",
      "Next.js",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "OpenAI",
    ],
    impact: [
      "80% reduction in reconciliation time",
      "95% match success rate on invoice recon",
    ],
    learnings:
      "Shipping LLM agents into a real financial workflow taught the value of human review checkpoints and structured outputs over open-ended generation — reliability mattered more than raw model capability.",
    links: {},
    origin: "work",
    relatedExperienceId: "mesha",
  },
  {
    slug: "document-ai",
    name: "Document AI",
    tagline: "OCR-Coordinate Extraction Pipeline",
    description:
      "In-house document extraction product — OCR-coordinate-driven table pipelines with automated validation.",
    problem:
      "The existing table extraction approach fed full documents to an LLM in one shot, which caused cell shifting and misalignment on dense, multi-page closing disclosure tables.",
    solution:
      "Reworked the pipeline to use OCR coordinates to crop each table individually and feed only the relevant page-level context to the model, then added a post-processing validation and correction layer to catch residual model errors.",
    architecture:
      "A Python-based product wrapper consumes and publishes extraction tasks over RabbitMQ, coordinating OCR coordinate detection, per-table LLM extraction, and validation before results are returned to the extraction product.",
    decisions: [
      "Cropped, coordinate-driven inputs instead of full-document prompts to cut hallucination and misalignment",
      "A dedicated validation/correction pass rather than trusting raw model output on critical fields",
      "RabbitMQ-backed request/response flow to keep the service decoupled and resilient",
    ],
    technologies: ["Python", "FastAPI", "RabbitMQ", "Docker", "AWS", "OCR"],
    impact: [
      "86% → 97% field extraction accuracy",
      "~98% true-positive accuracy on critical closing-disclosure tables",
    ],
    learnings:
      "Production LLM extraction needed engineering around the model, not just a better prompt — validation layers and constrained inputs mattered as much as the model itself.",
    links: {},
    origin: "work",
    relatedExperienceId: "infrrd",
  },
  {
    slug: "propellyr",
    name: "Propellyr",
    tagline: "Blockchain Data & AI Analytics",
    description:
      "Real-time on-chain price pipelines, a crypto tax engine, and AI-powered natural-language data analysis.",
    problem:
      "Propellyr needed reliable, real-time token pricing without paying for expensive third-party feeds, and its crypto tax product needed to track staking and lending earnings that don't show up as simple transfers.",
    solution:
      "Built a high-throughput Node.js pipeline that computed OHLCV prices directly from on-chain liquidity pool data using the AMM formula, a tax engine that tracked staking/lending earnings end to end, and later an AI data-analysis app that let users query CSV data in natural language via DuckDB plus a RAG pipeline for unstructured data extraction.",
    architecture:
      "Node.js ingestion service pulling on-chain data via Infura/web3.js into ClickHouse for the pricing pipeline; a Java/Spring Boot tax engine over the same ClickHouse store; and a Python/FastAPI + Next.js app that loaded uploaded CSVs into DuckDB, generated SQL from natural-language queries, and summarised results.",
    decisions: [
      "Built an in-house on-chain pricing engine instead of relying on a paid external price feed",
      "Used DuckDB for embedded, file-based analytics rather than standing up a full data warehouse for CSV uploads",
      "Split the tax engine into its own Java/Spring Boot service so an experienced Java team could own the critical calculation logic",
    ],
    technologies: [
      "Node.js",
      "Python",
      "FastAPI",
      "DuckDB",
      "ClickHouse",
      "AWS",
    ],
    impact: [
      "40% reduction in operational costs vs. external pricing services",
      "Multiple partnership offers from blockchain companies including Chainalysis",
    ],
    learnings:
      "Owning a data pipeline end to end — from raw on-chain events to a finished product — meant translating domain logic (AMM math, tax rules) into code that had to be exactly right, not just directionally close.",
    links: {},
    origin: "work",
    relatedExperienceId: "propellyr",
  },
  {
    slug: "portfolio",
    name: "Portfolio",
    tagline: "Terminal + AI Portfolio",
    description:
      "This site — a portfolio presented as an AI development environment, with a command-line terminal and a context-aware AI assistant.",
    problem:
      "A conventional portfolio page tells visitors about engineering work but doesn't demonstrate it — recruiters skim it and technical visitors have nothing to explore.",
    solution:
      "Built a Next.js site with three interfaces over one shared content source: a normal scrollable portfolio, a terminal with an extensible command system, and a streaming AI assistant that can answer questions about Daniel and link back into the site.",
    architecture:
      "App Router pages for structure and SEO, a small terminal engine (tokenizer → parser → command registry) driving both an inline hero terminal and a full-screen overlay, and an OpenRouter-backed streaming chat API that accepts a context identifier so answers about a specific project or role can be grounded without building the prompt in the browser.",
    decisions: [
      "Kept context resolution server-side — the client sends a contextType/contextId, not a constructed prompt",
      "Reused the same profile and project data across the web UI, terminal commands, and the AI system prompt to avoid maintaining duplicate facts",
    ],
    learnings:
      "Designing a small, extensible command parser and wiring contextual retrieval into a streaming chat API without over-engineering either one.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "OpenRouter"],
    impact: ["One shared content source powering the web UI, terminal, and AI"],
    links: {
      github: "https://github.com/dannyboy-1412",
    },
    origin: "personal",
  },
  {
    slug: "salary-stream",
    name: "StreamPay",
    tagline: "Continuous Salary Streaming",
    description:
      "A crypto app concept that streams salary continuously through the pay period instead of a single lump-sum payment.",
    problem:
      "Draft placeholder — full problem write-up to come.",
    solution:
      "Draft placeholder — an on-chain app streaming pay continuously over the month rather than releasing it all at once on payday.",
    architecture: "Draft placeholder — architecture details to be added.",
    decisions: ["Draft placeholder — engineering decisions to be added."],
    technologies: ["Solidity", "Node.js", "Ethereum"],
    impact: ["Draft placeholder — results to be added."],
    learnings: "Draft placeholder — to be added.",
    links: {},
    origin: "personal",
    placeholder: true,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug)
}

export function getProjectSuggestions(project: Project): string[] {
  return [
    `Tell me about Daniel's work on ${project.name}.`,
    `What was the hardest problem Daniel solved on ${project.name}?`,
    `Why did Daniel choose ${project.technologies[0]} for ${project.name}?`,
  ]
}
