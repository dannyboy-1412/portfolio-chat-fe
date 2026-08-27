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
  impact: string[]
  /** Role-level detail for roles without a per-project breakdown (e.g. Wipro). */
  problem?: string
  built?: string
  architecture?: string
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

export type Education = {
  period: string
  degree: string
  institution: string
  /** Short description of what the degree covered. */
  focus?: string
  /** Mono metadata line, e.g. teams and societies. */
  activities?: string
  /** Concrete bullets on involvement beyond coursework. */
  highlights?: string[]
}

export const PROFILE = {
  name: "Daniel A Rodrigues",
  shortName: "Daniel",
  role: "Software Engineer",
  headline: "I build backend systems, AI products and data platforms.",
  tagline: "Backend · AI · Data · Cloud",
  aboutHeadline: "I like building systems where good engineering and AI meet.",
  pitch:
    "I build software that turns complex problems into reliable systems - document AI, accounting agents, and on-chain data. Open to full-stack, backend, and AI roles; currently exploring ML and AI. Ask my assistant anything about the work.",
  location: "Victoria, Australia · Melbourne / Geelong",
  status: "Studying · Master of Applied AI @ Deakin",
  /** Configurable hero status indicator, e.g. "OPEN TO OPPORTUNITIES" or "CURRENTLY BUILDING". */
  statusIndicator: "OPEN TO OPPORTUNITIES",
  yearsExperience: "5+ years experience",
  education: [
    {
      period: "2026 — 2028",
      degree: "Master of Applied AI",
      institution: "Deakin University",
    },
    {
      period: "2017 — 2021",
      degree: "B.Tech Electrical & Electronics Engineering",
      institution: "VIT Vellore",
      focus:
        "Studied electrical and electronics while building a strong foundation in software engineering, computer science, and problem solving.",
      activities: "Activities and societies: VIT Football Team · Ojas Racing Club Management Team",
      highlights: [
        "Represented VIT on the university football team, where selection and retention depended on showing up and performing every week.",
        "Sat on the management team of Ojas Racing Club, helping organise and coordinate the university's racing team.",
      ],
    },
  ] satisfies Education[],
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
      "Document AI for an in-house extraction product, plus DocIQ, an internal test-automation platform shipped from scope to v1 in two weeks.",
    highlights: [
      "Reworked core table extraction from full-document LLM calls to an OCR-coordinate pipeline that crops each table and feeds page-level context",
      "Added post-processing validation and correction, lifting no-touch processing and true-positive accuracy to ~98% on critical closing-disclosure tables",
      "Engineered the Python product wrapper that consumes and publishes extraction tasks over RabbitMQ",
      "Built DocIQ, an internal platform that automated multi-team test workflows behind a dashboard",
      "As SDE-2, managed intern and trainee engineers and interviewed candidates",
    ],
    tech: ["Python", "FastAPI", "RabbitMQ", "Docker", "AWS", "TypeScript"],
    suggestedQuestion:
      "Tell me about your work at INFRRD on document extraction and DocIQ.",
    keyMetric: "86% → 97% field extraction accuracy",
    impact: [
      "86% → 97% field extraction accuracy",
      "~98% true-positive accuracy on critical closing-disclosure tables",
    ],
  },
  {
    id: "mesha",
    company: "Mesha",
    role: "Software Engineer",
    period: "Aug 2024 - Feb 2025",
    summary:
      "AI agents for accounting, anchored by two systems: Recon for invoice reconciliation and the Agent Builder for client-built workflows.",
    highlights: [
      "Shipped a Closing agent that pulled Xero P/L and Balance Sheet data and emailed executive summaries to clients",
      "Built a Clarification agent that chased unclear transactions and auto-generated reports over client email",
      "Built Recon, an agent matching bank transactions to unpaid invoices with LLMs",
      "Designed the AI Agent Builder with human-in-the-loop review at each workflow step",
      "Automated bank-transaction extraction and Xero upload from the company's Chrome extension in one click",
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
    impact: [
      "80% reduction in reconciliation time",
      "95% match success rate on invoice recon",
    ],
  },
  {
    id: "propellyr",
    company: "Propellyr",
    role: "Software Development Engineer",
    period: "Aug 2022 - Aug 2024",
    summary:
      "Two years across three projects at a blockchain data platform that later pivoted into generative AI: LP earnings research, an on-chain price pipeline, and an AI data analysis app.",
    highlights: [
      "Researched multiple crypto protocols' smart contracts to model what liquidity providers actually earn, directing the tax engine build",
      "Architected a high-throughput Node.js pipeline for real-time OHLCV prices from on-chain liquidity pools",
      "Shipped an AI data analysis app (CSV → DuckDB → NL queries → insights) plus a RAG extraction pipeline",
    ],
    tech: ["Python", "FastAPI", "Node.js", "DuckDB", "ClickHouse", "AWS"],
    suggestedQuestion:
      "What did you build at Propellyr, including the blockchain and AI work?",
    keyMetric: "40% reduction in pricing infra costs",
    impact: [
      "40% reduction in operational costs vs. external pricing services",
      "Multiple partnership offers from blockchain companies including Chainalysis",
    ],
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
    title: "Languages",
    skills: ["Python", "C#", "TypeScript"],
  },
  {
    title: "Backend",
    skills: ["FastAPI", "Express", "Django", ".NET", "RAG"],
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Data",
    skills: ["PostgreSQL", "MongoDB", "Redis", "DuckDB", "ClickHouse", "Pinecone"],
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
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "projects", label: "Projects", href: "#projects" },
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
