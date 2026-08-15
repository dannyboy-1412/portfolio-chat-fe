export type Experience = {
  id: string
  company: string
  role: string
  period: string
  summary: string
  highlights: string[]
  tech: string[]
  suggestedQuestion: string
}

export type SkillGroup = {
  title: string
  skills: string[]
}

export const PROFILE = {
  name: "Daniel A Rodrigues",
  shortName: "Daniel",
  role: "Software Engineer",
  tagline: "Backend · AI",
  pitch:
    "I build backend-heavy systems — document AI, accounting agents, and on-chain data. Open to full-stack, backend, and AI roles; currently exploring ML and AI. Ask my assistant anything about the work.",
  location: "Victoria, Australia · Melbourne / Geelong",
  status: "Studying · Master of Applied AI @ Deakin",
  yearsExperience: "5+ years experience",
  education: [
    "Master of Applied AI, Deakin University (2026–2028)",
    "B.Tech Electrical & Electronics Engineering, VIT Vellore (2017–2021)",
  ],
  languages: ["English (native)", "Hindi", "Malayalam"],
  interests: [
    "Gaming · Valorant",
    "Football · Liverpool FC",
    "Favourite film · The Prestige",
  ],
  about:
    "Electrical and Electronics Engineering graduate from VIT Vellore, now a full-time Master of Applied AI student at Deakin University (expected 2028). I've built products from scratch at two startups — blockchain data at one, agentic AI at the other — and most recently worked on AI document extraction at INFRRD. After shipping LLM work in production I left to go deeper on applied AI through the Masters. I'm looking for backend + AI roles, open to full-stack, and can work hybrid or remote (Melbourne or Geelong if on-site). Side projects live on GitHub, including this portfolio and a crypto app that streams salary over the month instead of a lump sum.",
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
    period: "Apr 2025 — Apr 2026",
    summary:
      "Built document AI for an in-house extraction product — OCR-coordinate-driven table pipelines, post-processing validation, and a RabbitMQ-backed Python service wrapper.",
    highlights: [
      "Reworked core table extraction from full-document LLM calls to an OCR-coordinate pipeline that crops each table and feeds page-level context",
      "Added post-processing validation and correction, lifting no-touch processing and true-positive accuracy to ~98% on critical closing-disclosure tables",
      "Engineered the Python product wrapper that consumes and publishes extraction tasks over RabbitMQ",
      "As SDE-2, managed intern and trainee engineers and interviewed candidates",
    ],
    tech: ["Python", "FastAPI", "RabbitMQ", "Docker", "AWS", "TypeScript"],
    suggestedQuestion:
      "Tell me about your work at INFRRD on document extraction and table OCR.",
  },
  {
    id: "mesha",
    company: "Mesha",
    role: "Software Engineer",
    period: "Aug 2024 — Feb 2025",
    summary:
      "Built AI agents for accounting — Closing, Clarification, and Invoice Recon end to end, plus an AI agent builder with human-in-the-loop review.",
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
  },
  {
    id: "propellyr",
    company: "Propellyr",
    role: "Software Development Engineer",
    period: "Aug 2022 — Aug 2024",
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
  },
  {
    id: "wipro",
    company: "Wipro Limited",
    role: "Project Engineer",
    period: "Jun 2021 — Jul 2022",
    summary:
      "First role after graduation — data analysis on a large-scale big-data project using Python and pandas.",
    highlights: [
      "Ran data analysis on a large-scale big-data project using Python and pandas",
    ],
    tech: ["Python", "Pandas", "C++"],
    suggestedQuestion: "What was your role at Wipro after graduating?",
  },
]

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Languages",
    skills: ["TypeScript", "Python", "Go", "JavaScript", "C++"],
  },
  {
    title: "Backend",
    skills: ["Express", "FastAPI", "Flask", "Node.js"],
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js"],
  },
  {
    title: "Data",
    skills: ["PostgreSQL", "MongoDB", "ClickHouse", "DuckDB", "Redis"],
  },
  {
    title: "Cloud & Infra",
    skills: ["AWS", "RabbitMQ", "Docker", "Jenkins", "Grafana"],
  },
]

export const CHAT_SUGGESTIONS = [
  "How many years of experience do you have?",
  "What companies have you worked for?",
  "What is your education background?",
] as const

export const NAV_LINKS = [
  { id: "chat", label: "Chat", href: "#chat" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "about", label: "About", href: "#about" },
] as const
