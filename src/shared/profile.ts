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
  tagline: "Full Stack · Backend-focused",
  pitch:
    "Full-stack developer who loves building apps - with a soft spot for backend engineering. Ask my assistant anything about my work.",
  location: "Victoria, Australia",
  openTo: "Open to remote",
  yearsExperience: "5 yrs",
  education: [
    "Masters of Applied AI, Deakin University Waurn Ponds (current)",
    "B.Tech Electrical & Electronics Engineering, VIT Vellore (2017–2021)",
  ],
  languages: ["English", "Hindi", "Malayalam"],
  interests: [
    "Gaming · Valorant",
    "Football · Liverpool FC",
    "Thrillers · The Prestige",
  ],
  about:
    "EEE grad from VIT Vellore, currently a full-time Masters of Applied AI student at Deakin University (Waurn Ponds). I've worked at large corporate companies, built products from scratch at two startups - one in blockchain, one in agentic AI - and most recently focused on AI document extraction. Based in Victoria, Australia and open to remote work.",
  socials: {
    github: "https://github.com/dannyboy-1412",
    linkedin: "https://www.linkedin.com/in/daniel-rodrigues14",
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
      "Reworked core table extraction from full-document LLM calls to an OCR-coordinate pipeline that crops each table and feeds page-level context for cleaner extraction",
      "Added post-processing validation and correction, lifting no-touch processing and true-positive accuracy to ~98% on critical closing-disclosure tables",
      "Engineered the Python product wrapper that consumes and publishes extraction tasks over RabbitMQ",
    ],
    tech: [
      "Python",
      "FastAPI",
      "Flask",
      "RabbitMQ",
      "Docker",
      "AWS",
      "TypeScript",
      "React",
      "Jenkins",
      "Grafana",
    ],
    suggestedQuestion:
      "Tell me about your work at INFRRD on document extraction and table OCR.",
  },
  {
    id: "mesha",
    company: "Mesha",
    role: "Software Engineer",
    period: "Aug 2024 — Feb 2025",
    summary:
      "Building AI agents for accounting — Closing, Clarification, and Invoice Recon agents end to end, plus an AI agent builder with human-in-the-loop review.",
    highlights: [
      "Closing agent: Xero P/L and Balance Sheet summaries emailed to clients",
      "Clarification agent: unclear transaction emails with webhook replies",
      "Invoice Recon agent: match bank transactions to unpaid invoices via LLMs",
      "AI Agent Builder with human-in-the-loop workflow steps",
      "Chrome extension to extract bank transactions and upload into Xero",
    ],
    tech: [
      "TypeScript",
      "Express",
      "Next.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
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
      "High-throughput Node.js pipeline for real-time OHLCV prices from liquidity pools",
      "Crypto tax calculation engine tracking staking and lending earnings",
      "AI-powered data analysis app (CSV → DuckDB → NL queries → insights)",
      "RAG extraction pipeline over unstructured documents",
    ],
    tech: [
      "Python",
      "FastAPI",
      "Node.js",
      "Next.js",
      "DuckDB",
      "ClickHouse",
      "AWS",
      "RabbitMQ",
    ],
    suggestedQuestion:
      "What did you build at Propellyr, including the blockchain and AI work?",
  },
  {
    id: "wipro",
    company: "Wipro Limited",
    role: "Project Engineer",
    period: "Jun 2021 — Jul 2022",
    summary:
      "Post-grad role on a big-data project after C++ training — data analysis with Python and pandas.",
    highlights: [
      "Completed Wipro C++ training program",
      "Data analysis on a large-scale big-data project",
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
    skills: ["Express", "FastAPI", "Flask", "Node.js", "Next.js", "React"],
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
