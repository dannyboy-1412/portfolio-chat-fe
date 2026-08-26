export type Experience = {
  id: string
  company: string
  role: string
  period: string
  summary: string
  highlights: string[]
  tech: string[]
  suggestedQuestion: string
  /** Short badge metric shown on the collapsed timeline entry. */
  keyMetric: string
  problem: string
  built: string
  architecture: string
  impact: string[]
  /** Slug of the matching entry in `PROJECTS`, if this role has one. */
  projectSlug?: string
}

export type SkillGroup = {
  title: string
  skills: string[]
}

export type InterestCategory = {
  id: string
  label: string
  items: string[]
}

export const PROFILE = {
  name: "Daniel A Rodrigues",
  shortName: "Daniel",
  role: "Software Engineer",
  tagline: "Backend · AI · Systems",
  pitch:
    "I build software that turns complex problems into reliable systems - document AI, accounting agents, and on-chain data. Open to full-stack, backend, and AI roles; currently exploring ML and AI. Ask my assistant anything about the work.",
  location: "Victoria, Australia · Melbourne / Geelong",
  status: "Studying · Master of Applied AI @ Deakin",
  /** Configurable hero status indicator, e.g. "OPEN TO OPPORTUNITIES" or "CURRENTLY BUILDING". */
  statusIndicator: "OPEN TO OPPORTUNITIES",
  yearsExperience: "5+ years experience",
  education: [
    "Master of Applied AI, Deakin University (2026-2028)",
    "B.Tech Electrical & Electronics Engineering, VIT Vellore (2017-2021)",
  ],
  languages: ["English (native)", "Hindi", "Malayalam"],
  about:
    "I'm a software engineer interested in building systems that combine strong engineering foundations with AI. My work has taken me across backend systems, AI applications and full-stack products - from blockchain data pipelines to agentic AI for accounting to document extraction at scale. I've built products from scratch at two startups and most recently worked on AI document extraction at INFRRD. Currently studying a Master of Applied AI at Deakin, and looking for backend + AI roles.",
  socials: {
    github: "https://github.com/dannyboy-1412",
    linkedin: "https://www.linkedin.com/in/daniel-rodrigues14",
    email: "danielantorodri@gmail.com",
    resume: "/resume.pdf",
    resumeDownloadName: "daniel_resume.pdf",
  },
} as const

export const EXPERIENCES: Experience[] = [
  {
    id: "infrrd",
    company: "INFRRD",
    role: "Software Development Engineer-2",
    period: "Apr 2025 - Apr 2026",
    summary:
      "Built document AI for an in-house extraction product - OCR-coordinate-driven table pipelines, post-processing validation, and a RabbitMQ-backed Python service wrapper.",
    highlights: [
      "Reworked core table extraction from full-document LLM calls to an OCR-coordinate pipeline that crops each table and feeds page-level context",
      "Added post-processing validation and correction, lifting no-touch processing and true-positive accuracy to ~98% on critical closing-disclosure tables",
      "Engineered the Python product wrapper that consumes and publishes extraction tasks over RabbitMQ",
      "As SDE-2, managed intern and trainee engineers and interviewed candidates",
    ],
    tech: ["Python", "FastAPI", "RabbitMQ", "Docker", "AWS", "TypeScript"],
    suggestedQuestion:
      "Tell me about your work at INFRRD on document extraction and table OCR.",
    keyMetric: "86% → 97% field extraction accuracy",
    problem:
      "Full-document LLM calls for table extraction were prone to cell shifting and misalignment on dense, multi-page closing-disclosure tables.",
    built:
      "An OCR-coordinate-driven pipeline that crops each table individually and feeds page-level context to the model, plus a post-processing validation and correction layer.",
    architecture:
      "A Python product wrapper consumes and publishes extraction tasks over RabbitMQ, coordinating OCR coordinate detection, per-table LLM extraction, and validation before results return to the extraction product.",
    impact: [
      "86% → 97% field extraction accuracy",
      "~98% true-positive accuracy on critical closing-disclosure tables",
    ],
    projectSlug: "document-ai",
  },
  {
    id: "mesha",
    company: "Mesha",
    role: "Software Engineer",
    period: "Aug 2024 - Feb 2025",
    summary:
      "Built AI agents for accounting - Closing, Clarification, and Invoice Recon end to end, plus an AI agent builder with human-in-the-loop review.",
    highlights: [
      "Shipped a Closing agent that pulled Xero P/L and Balance Sheet data and emailed executive summaries to clients",
      "Built an Invoice Recon agent that matched bank transactions to unpaid invoices with LLMs",
      "Designed an AI Agent Builder with human-in-the-loop review at each workflow step",
    ],
    tech: [
      "TypeScript",
      "Express",
      "Next.js",
      "PostgreSQL",
      "MongoDB",
      "AWS",
    ],
    suggestedQuestion: "Tell me about your work at Mesha and the AI agents you built.",
    keyMetric: "80% reduction in reconciliation time",
    problem:
      "Accountants spent hours each month on manual closing summaries, unclear-transaction follow-ups, and invoice reconciliation.",
    built:
      "Three production agents - Closing, Clarification, and Invoice Recon - plus an AI Agent Builder for assembling new workflows with human review at each step.",
    architecture:
      "TypeScript/Express backend with a Next.js frontend, PostgreSQL and MongoDB for storage, and AWS for hosting; agents used structured LLM outputs and human-in-the-loop review before any client-facing action.",
    impact: [
      "80% reduction in reconciliation time",
      "95% match success rate on invoice recon",
    ],
    projectSlug: "mesha",
  },
  {
    id: "propellyr",
    company: "Propellyr",
    role: "Software Development Engineer",
    period: "Aug 2022 - Aug 2024",
    summary:
      "Blockchain data platform that later pivoted into generative AI. Built real-time on-chain price pipelines, a crypto tax engine, and RAG / NL-to-SQL analysis tools.",
    highlights: [
      "Architected a high-throughput Node.js pipeline for real-time OHLCV prices from on-chain liquidity pools",
      "Built a crypto tax engine tracking staking and lending earnings",
      "Shipped an AI data analysis app (CSV → DuckDB → NL queries → insights)",
    ],
    tech: ["Python", "FastAPI", "Node.js", "DuckDB", "ClickHouse", "AWS"],
    suggestedQuestion:
      "What did you build at Propellyr, including the blockchain and AI work?",
    keyMetric: "40% reduction in pricing infra costs",
    problem:
      "Propellyr needed reliable, real-time token pricing without paying for expensive third-party feeds, and staking/lending earnings didn't show up as simple transfers for tax purposes.",
    built:
      "A Node.js pipeline computing OHLCV prices from on-chain liquidity pool data, a tax engine tracking staking/lending earnings, and later an AI data-analysis app plus a RAG pipeline for unstructured data extraction.",
    architecture:
      "Node.js ingestion via Infura/web3.js into ClickHouse for pricing; a Java/Spring Boot tax engine over the same store; a Python/FastAPI + Next.js app loading CSVs into DuckDB for natural-language queries.",
    impact: [
      "40% reduction in operational costs vs. external pricing services",
      "Multiple partnership offers from blockchain companies including Chainalysis",
    ],
    projectSlug: "propellyr",
  },
  {
    id: "wipro",
    company: "Wipro Limited",
    role: "Project Engineer",
    period: "Jun 2021 - Jul 2022",
    summary:
      "First role after graduation - data analysis on a large-scale big-data project using Python and pandas.",
    highlights: [
      "Ran data analysis on a large-scale big-data project using Python and pandas",
    ],
    tech: ["Python", "Pandas", "C++"],
    suggestedQuestion: "What was your role at Wipro after graduating?",
    keyMetric: "First role · large-scale data analysis",
    problem:
      "Needed to ramp up quickly on a large enterprise codebase and a big-data project straight out of university.",
    built:
      "Data analysis workflows using Python and pandas as part of a large-scale big-data project, after completing Wipro's C++ training program.",
    architecture:
      "Analysis scripts and reporting built in Python/pandas against the project's existing big-data infrastructure.",
    impact: ["Ramped from a C++ training program into a live big-data project"],
  },
]

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Backend",
    skills: ["Python", "Node.js", "FastAPI", "Express", "Go"],
  },
  {
    title: "AI",
    skills: ["LLMs", "RAG", "LangChain", "AI Agents", "Document AI"],
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript"],
  },
  {
    title: "Data",
    skills: ["PostgreSQL", "MongoDB", "Redis", "DuckDB", "ClickHouse"],
  },
  {
    title: "Infrastructure",
    skills: ["AWS", "Docker", "RabbitMQ", "Jenkins", "Grafana"],
  },
]

export const INTERESTS: InterestCategory[] = [
  { id: "football", label: "Football", items: ["Liverpool FC"] },
  { id: "gaming", label: "Gaming", items: ["Valorant", "CS:GO", "FIFA"] },
  {
    id: "music",
    label: "Music",
    items: ["Radiohead", "Twenty One Pilots", "Guitar"],
  },
  { id: "films", label: "Films", items: ["The Prestige", "Crime / Horror"] },
]

export const CHAT_SUGGESTIONS = [
  "How many years of experience do you have?",
  "What companies have you worked for?",
  "What is your education background?",
] as const

export const NAV_LINKS = [
  { id: "work", label: "Work", href: "#work" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "about", label: "About", href: "#about" },
] as const

export const CONTACT_NAV_LINK = {
  id: "contact",
  label: "Contact",
  href: "#contact",
} as const

export function getExperienceById(id: string): Experience | undefined {
  return EXPERIENCES.find((experience) => experience.id === id)
}

export function getExperienceSuggestions(experience: Experience): string[] {
  return [
    experience.suggestedQuestion,
    `What was the biggest challenge Daniel faced at ${experience.company}?`,
    `Why did Daniel leave ${experience.company}?`,
  ]
}
