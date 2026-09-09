export type ProjectLink = {
  github?: string
  live?: string
}

export type ProjectMetric = {
  value: string
  label: string
}

export type ProjectVisual = {
  src: string
  alt: string
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
  origin: 'work' | 'personal'
  relatedExperienceId?: string
  /** Prominent headline metrics for editorial layouts; derived from `impact`. */
  metrics?: ProjectMetric[]
  /** Optional screenshot/diagram shown large on project pages. */
  visual?: ProjectVisual
}

export const PROJECTS: Project[] = [
  {
    slug: 'dociq',
    name: 'DocIQ',
    tagline: 'One-click test automation for internal teams',
    description:
      'An internal platform that put INFRRD\u2019s manual, script-by-script product testing behind a dashboard, built from scope to v1 in two weeks.',
    problem:
      'Teams testing the extraction product ran the whole flow by hand. QA\u2019s BugBuster run was typical: pick a batch of files, push them through the product\u2019s APIs, wait for every document to finish processing, then run the next script to compare the output data against a ground-truth file and produce an accuracy report. Each step sat idle until someone came back and kicked off the next one, so a single run ate hours of babysitting across teams.',
    solution:
      'Scoped, designed and shipped DocIQ, an internal platform where a user clicks a button on a dashboard and the entire run completes unattended: file selection, uploads through the product\u2019s APIs, processing, comparison against ground truth, and the final report.',
    architecture:
      'A React dashboard drives a Python/FastAPI backend that orchestrates each run. The backend stages the selected files, uploads them through the extraction product\u2019s APIs, polls processing status, then runs the comparison and report generation steps in sequence and stores the results for the team to review.',
    decisions: [
      'Automated the existing scripts\u2019 behaviour end to end instead of rewriting the checks themselves, so teams trusted the results from day one',
      'A dashboard over a CLI so QA and non-engineering teams could run it without setup',
      'Scoped v1 tightly to one full flow and shipped it in two weeks, using agentic coding practices to keep the pace without dropping review',
    ],
    technologies: ['Python', 'FastAPI', 'React', 'TypeScript'],
    impact: [
      'Replaced multi-step manual script runs with a single button on a dashboard',
      'Adopted by QA and other internal teams for repeated accuracy testing',
      'Scoped, designed and shipped v1 in two weeks using agentic coding practices',
    ],
    metrics: [{ value: '2 weeks', label: 'from scope to v1 in production' }],
    learnings:
      'The two-week deadline only worked because the v1 scope was ruthless: automate the flow people already ran, not the flow you could imagine them wanting.',
    links: {},
    origin: 'work',
    relatedExperienceId: 'infrrd',
  },
  {
    slug: 'document-ai',
    name: 'Document AI',
    tagline: 'OCR-Coordinate Extraction Pipeline',
    description:
      'A rework of INFRRD\u2019s in-house extraction product, replacing full-document LLM calls with an OCR-coordinate pipeline and a validation layer.',
    problem:
      'The existing table extraction approach fed full documents to an LLM in one shot, which caused cell shifting and misalignment on dense, multi-page closing disclosure tables.',
    solution:
      'Reworked the pipeline to use OCR coordinates to crop each table individually and feed only the relevant page-level context to the model, then added a post-processing validation and correction layer to catch residual model errors.',
    architecture:
      'A Python-based product wrapper consumes and publishes extraction tasks over RabbitMQ, coordinating OCR coordinate detection, per-table LLM extraction, and validation before results are returned to the extraction product.',
    decisions: [
      'Cropped, coordinate-driven inputs instead of full-document prompts to cut hallucination and misalignment',
      'A dedicated validation/correction pass rather than trusting raw model output on critical fields',
      'RabbitMQ-backed request/response flow to keep the service decoupled and resilient',
    ],
    technologies: ['Python', 'FastAPI', 'RabbitMQ', 'Docker', 'AWS', 'OCR'],
    impact: [
      '86% → 97% field extraction accuracy',
      '~98% true-positive accuracy on critical closing-disclosure tables',
    ],
    metrics: [
      { value: '97%', label: 'field extraction accuracy, up from 86%' },
      { value: '~98%', label: 'true-positive accuracy on critical tables' },
    ],
    learnings:
      'Production LLM extraction needed engineering around the model, not just a better prompt. Validation layers and constrained inputs mattered as much as the model itself.',
    links: {},
    origin: 'work',
    relatedExperienceId: 'infrrd',
  },
  {
    slug: 'recon',
    name: 'Recon',
    tagline: 'AI invoice reconciliation',
    description:
      'A Mesha agent that matches bank transactions to unpaid invoices, cutting reconciliation time by 80% for client accountants.',
    problem:
      'Accountants reconciled invoices against bank activity by hand every month: pull the transactions, pull the unpaid invoices, and eyeball which payment settles which invoice.',
    solution:
      'Built the Invoice Recon agent end to end. It pulls bank transactions from Plaid connections or file uploads, fetches unpaid invoices from the Stripe-synced store, matches them with LLMs, and shows the user a preview modal before anything is reconciled.',
    architecture:
      'TypeScript/Express services on AWS sit behind a Next.js frontend. Bank transactions come from Plaid or parsed statement uploads; invoices come from the MongoDB store synced from Stripe. A matching service combines both datasets in a prompt against OpenAI and Anthropic models, and the proposed matches return through a REST endpoint to a review modal before reconciliation.',
    decisions: [
      'A human reviews matches in a preview modal before reconciling, since the output touched client finances',
      'Combined extracted transactions and invoice data in one structured prompt instead of chaining separate classification steps',
      'Accepted both Plaid connections and file uploads so clients without linked bank accounts could still reconcile',
    ],
    technologies: [
      'TypeScript',
      'Express',
      'Next.js',
      'MongoDB',
      'PostgreSQL',
      'AWS',
      'OpenAI',
    ],
    impact: [
      '80% reduction in reconciliation time',
      '95% match success rate on invoice recon',
    ],
    metrics: [
      { value: '80%', label: 'reduction in reconciliation time' },
      { value: '95%', label: 'reconciliation match rate' },
    ],
    learnings:
      'Matching accuracy was only half the job. The preview modal before reconciliation is what made accountants trust the agent with client books.',
    links: {},
    origin: 'work',
    relatedExperienceId: 'mesha',
  },
  {
    slug: 'agent-builder',
    name: 'Agent Builder',
    tagline: 'Custom AI workflows with human review',
    description:
      'A platform for assembling AI agent workflows from existing services, with human-in-the-loop review at every step.',
    problem:
      'Every new client requirement at Mesha meant new bespoke endpoints, so the four-person engineering team became the bottleneck for work that followed patterns the product already had.',
    solution:
      'Designed an AI Agent Builder that lets clients assemble custom workflows from the company\u2019s existing backend services on a plug-and-play basis. Every step in a workflow has human-in-the-loop review, so agents never act on client finances unchecked.',
    architecture:
      'Workflows are composed from existing service building blocks in a Next.js frontend and executed by the TypeScript/Express backend on AWS, with PostgreSQL and MongoDB for storage. Each workflow step pauses for human review before the next action runs.',
    decisions: [
      'Composed new workflows from existing backend services instead of writing one-off integrations per client',
      'Human review at each step rather than autonomy at the end, so a bad output is caught before it compounds',
      'Building blocks shared across workflows so the second and third agent cost a fraction of the first',
    ],
    technologies: [
      'TypeScript',
      'Express',
      'Next.js',
      'PostgreSQL',
      'MongoDB',
      'AWS',
    ],
    impact: [
      'Clients could build custom agent workflows without waiting on new API development',
      'Cut development time for new client-specific workflows',
    ],
    learnings:
      'Reliability came from structure, not model capability. Review checkpoints and reusable steps beat open-ended generation every time money was on the line.',
    links: {},
    origin: 'work',
    relatedExperienceId: 'mesha',
  },
  {
    slug: 'lp-earnings',
    name: 'LP Earnings Research',
    tagline: 'How other protocols pay liquidity providers',
    description:
      'Research across other crypto platforms on how their smart contracts and transactions determine what liquidity providers earn, plus Node.js and Solidity proofs of concept and recommendations for how Propellyr could use that data in the tax product.',
    problem:
      'For tax purposes, Propellyr needed the earnings of liquidity providers and stakers on each crypto platform. Those earnings never appear as a simple transfer. They sit inside each protocol\u2019s smart contract mechanics, and every protocol computes them differently. Propellyr had no smart contracts of its own.',
    solution:
      'Researched other crypto platforms, read their smart contracts and transactions, and worked out how each one computes provider earnings. Built Node.js and Solidity proofs of concept to check the math against real deposits and withdrawals, then wrote recommendations for how the tax product could use that contract data and those transactions.',
    architecture:
      'Proofs of concept in Node.js and Solidity, not a production engine. Solidity PoCs modelled how other platforms\u2019 contracts compute liquidity-provider earnings. Node.js scripts fetched real deposit and withdrawal transactions from those protocols, priced the tokens at both timestamps, and checked the result against what the depositor actually received. The research and PoCs were direction for the tax product team, who later built the production engine in Java and Spring Boot over ClickHouse.',
    decisions: [
      'Modelled other platforms\u2019 contracts in Solidity rather than inventing a Propellyr contract',
      'Verified calculated earnings against the tokens a depositor actually received on withdrawal, not just the whitepaper formula',
      'One protocol at a time from the contracts up, instead of assuming AMMs share one earnings model',
    ],
    technologies: ['Solidity', 'Node.js'],
    impact: [
      'PoCs verified earnings against real on-chain withdrawals',
      'Gave the tax product team a protocol-by-protocol model of how to compute LP earnings from other platforms\u2019 contract data',
    ],
    learnings:
      'The whitepaper version of a protocol and the deployed contract version rarely match. Reading transactions directly settled every disagreement.',
    links: {},
    origin: 'work',
    relatedExperienceId: 'propellyr',
  },
  {
    slug: 'onchain-ohlcv',
    name: 'On-Chain OHLCV Pricer',
    tagline: 'Token prices straight from the blockchain',
    description:
      'A real-time pipeline that computes OHLCV token prices from on-chain liquidity pools, replacing a paid external price feed.',
    problem:
      'Propellyr\u2019s tax calculator depended on a third-party pricing service that was expensive, rate-limited, and a single point of failure for the core product.',
    solution:
      'Researched AMMs and liquidity pools, then built a Node.js pipeline that fetches on-chain pool data through Infura and web3.js and computes token prices with the AMM formula (x*y=k), mostly from Uniswap pools. Prices came straight from the blockchain, so no external price API was involved at all.',
    architecture:
      'A high-throughput Node.js ingestion service pulls liquidity pool state via Infura and web3.js, applies the AMM formula to derive per-block prices, aggregates them into OHLCV candles, and stores everything in ClickHouse on AWS for the tax calculator to query.',
    decisions: [
      'Computed prices from pool reserves with the AMM formula instead of paying an external feed',
      'ClickHouse for candle storage, since the workload is append-heavy time-series data',
      'Built for real-time delivery, since the tax product priced transactions at execution time',
    ],
    technologies: ['Node.js', 'ClickHouse', 'AWS', 'web3.js', 'Infura'],
    impact: [
      '40% reduction in operational costs versus the external pricing service',
      'Removed the third-party dependency from the core tax product',
    ],
    metrics: [
      { value: '40%', label: 'reduction in operational costs vs. external pricing' },
    ],
    learnings:
      'A price is a derived value, and deriving it from first principles on-chain turned a vendor bill into infrastructure we owned.',
    links: {},
    origin: 'work',
    relatedExperienceId: 'propellyr',
  },
  {
    slug: 'ai-data-analysis',
    name: 'AI Data Analysis',
    tagline: 'Natural-language analysis over uploaded data',
    description:
      'An app that lets users upload a CSV and query it in plain English, plus a RAG pipeline for extracting data from unstructured files.',
    problem:
      'After Propellyr pivoted into generative AI, the bet was that analysis should not require SQL or a data team. Users had CSVs and documents and questions, and nothing in between.',
    solution:
      'Built an AI data analysis application where users upload a CSV and ask questions in natural language. The app generates SQL against DuckDB, then feeds the results back to the model to draw conclusions and generate Python code for visualisations. Also built a RAG pipeline that extracts requested data points from unstructured files based on a user\u2019s query.',
    architecture:
      'A Python/FastAPI backend and Next.js frontend on AWS. Uploaded CSVs are processed into DuckDB tables; natural-language queries are turned into SQL by the model, executed, and the results are summarised with generated Python for charts. For unstructured data, a processing service extracts text, chunks it, and stores embeddings in a vector database; the RAG extractor expands an input metric into embedded queries, searches the store, and answers from the extracted data.',
    decisions: [
      'DuckDB for embedded, file-based analytics instead of standing up a data warehouse per upload',
      'Generated Python for charts so visualisations were code, not hand-configured dashboards',
      'A metric-to-queries expansion step in the RAG extractor, since one embedded query rarely covers a full data point',
    ],
    technologies: ['Python', 'FastAPI', 'Next.js', 'DuckDB', 'AWS'],
    impact: [
      'Contributed to successful fundraising after the pivot',
      'Established the company\u2019s technical foundation in generative AI',
    ],
    learnings:
      'Letting the model write both the SQL and the chart code worked better than expected. The guardrails that mattered were the schema context going in and the result summary coming out.',
    links: {},
    origin: 'work',
    relatedExperienceId: 'propellyr',
  },
  {
    slug: 'portfolio',
    name: 'Portfolio',
    tagline: 'Editorial personal site',
    description:
      'This site. A scrollable portfolio that reads experience, projects, and bio from one shared content source.',
    problem:
      'A conventional portfolio page tells visitors about engineering work but doesn\u2019t demonstrate it. Recruiters skim it and technical visitors have nothing to explore.',
    solution:
      'Built a static Vite site with an editorial layout over one shared content module: roles, case studies, and bio live in TypeScript and render on the home page and on per-project routes.',
    architecture:
      'A React SPA with React Router. Home is a single scroll of sections. Each project in the shared list gets a `/projects/:slug` page. The build copies `index.html` for every slug so GitHub Pages can serve those URLs without a server.',
    decisions: [
      'Kept profile and project facts in shared TypeScript modules so the UI and a later assistant prompt read the same source',
      'Shipped as static files on GitHub Pages instead of a Node host, since the live site has no API',
      'Used React Router with a repo base path so project URLs stay `/projects/:slug` under GitHub project pages',
    ],
    learnings:
      'A static site with known slugs is enough. The HTML copies at build time are the whole routing trick GitHub Pages needs.',
    technologies: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'React Router'],
    impact: ['One shared content source powering the home page and every project case study'],
    metrics: [
      { value: '1', label: 'shared content source for the home page and project routes' },
    ],
    links: {
      github: 'https://github.com/dannyboy-1412',
    },
    origin: 'personal',
  },
  {
    slug: 'salary-stream',
    name: 'StreamPay',
    tagline: 'Continuous salary streaming',
    description:
      'A crypto app that streams salary continuously through the pay period instead of a single lump-sum transfer on payday.',
    problem:
      'Salary arrives as one lump sum at the end of the month, even though the work it pays for happened continuously. Employees wait weeks to touch money they have already earned.',
    solution:
      'Built on Superfluid\u2019s Super Tokens, which extend ERC-20 with constant flow agreements. An employer paying 4000 USDC a month opens a stream, and the balance accrues to the employee every second instead of arriving in one transfer. The employee can withdraw at any point; there is no payday to wait for.',
    architecture:
      'A Solidity contract creates and manages Superfluid money streams between employer and employee accounts on an EVM testnet, with a Node.js backend for account and stream management.',
    decisions: [
      'Superfluid\u2019s constant flow agreements over a custom vesting contract, since the streaming primitive is audited and settles on every block',
      'USDC as the streamed token so salary amounts stay dollar-denominated',
    ],
    technologies: ['Solidity', 'Superfluid', 'Node.js', 'Ethereum', 'USDC'],
    impact: [
      'A working stream where a 4000 USDC monthly salary accrues per second and is withdrawable any time',
    ],
    learnings:
      'Superfluid\u2019s constant flow agreement replaces payday with a balance that never stops moving. The whole concept of "waiting for your salary" disappears once the stream is open.',
    links: {},
    origin: 'personal',
  },
]

export const PERSONAL_PROJECTS: Project[] = PROJECTS.filter(
  (project) => project.origin === 'personal'
)

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug)
}

export function getProjectsByExperienceId(experienceId: string): Project[] {
  return PROJECTS.filter(
    (project) =>
      project.origin === 'work' && project.relatedExperienceId === experienceId
  )
}

export function getProjectSuggestions(project: Project): string[] {
  return [
    `Tell me about Daniel's work on ${project.name}.`,
    `What was the hardest problem Daniel solved on ${project.name}?`,
    `Why did Daniel choose ${project.technologies[0]} for ${project.name}?`,
  ]
}
