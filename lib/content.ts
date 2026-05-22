// ════════════════════════════════════════════════════════════════════
//  SITE CONTENT
//  Real data sourced from Utkarsh's resume and GitHub. Edit this file
//  to update anything the portfolio displays.
// ════════════════════════════════════════════════════════════════════

export const profile = {
  name: "Utkarsh Singh",
  first: "Utkarsh",
  last: "Singh",
  role: "AI & Platform Engineer",
  location: "Austin, TX",
  availability: "Open to new opportunities",
  email: "hello@singhcodes.dev",
  intro:
    "I'm a senior software engineer with 11+ years building production systems in financial services — now designing and shipping GenAI and agentic AI features end to end.",
};

export const socials = [
  { label: "GitHub", url: "https://github.com/vib795" },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/connectwithutkarshsingh/",
  },
  { label: "Medium", url: "https://medium.com/@connectwithutkarshsingh" },
];

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
];

export const marquee = [
  "Python",
  "FastAPI",
  "RAG",
  "Agentic AI",
  "LangGraph",
  "LiteLLM",
  "Qdrant",
  "Neo4j",
  "AWS",
  "Kubernetes",
  "Kafka",
  "MCP",
];

export const about = {
  heading: { lead: "Eleven years of backend.", tail: "Now building agents." },
  paragraphs: [
    "I'm a senior engineer with 11+ years building production backend systems in financial services — trading, money movement, and securities management — including four years delivering event-driven microservices and high-traffic investment platforms for Fidelity.",
    "Now I design and ship GenAI and agentic AI features end to end: tool-calling agents, multi-step orchestration, and RAG with hybrid retrieval. I also lead internal AI enablement — agentic frameworks, the OpenAI SDK, and organization-scale GitHub Copilot adoption.",
  ],
  stack: [
    { label: "Languages", items: ["Python", "TypeScript", "Go", "Java", "SQL"] },
    {
      label: "GenAI & Agents",
      items: ["RAG", "LangGraph", "CrewAI", "MCP", "LiteLLM"],
    },
    {
      label: "Backend",
      items: ["FastAPI", "asyncio", "Kafka", "Microservices"],
    },
    {
      label: "Infra & Data",
      items: ["AWS", "Kubernetes", "PostgreSQL", "Qdrant", "Neo4j"],
    },
  ],
};

export type Project = {
  name: string;
  year: string;
  category: string;
  blurb: string;
  stack: string[];
  link?: string; // public URL — omitted for internal / private work
};

export const projects: Project[] = [
  {
    name: "Code-Analyzer",
    year: "2025",
    category: "RAG Platform",
    blurb:
      "A code-intelligence platform that ingests and queries large multi-repository codebases — 600+ repos at its first engagement — to power software-engineering audits. A seven-layer hybrid pipeline pairs tree-sitter parsing with a Qdrant + Neo4j + OpenSearch retrieval backbone and cross-encoder reranking.",
    stack: ["Python", "Qdrant", "Neo4j", "LiteLLM"],
  },
  {
    name: "Resume Screener",
    year: "2025",
    category: "AI System",
    blurb:
      "An AI resume-evaluation system on FastAPI that flags exact duplicates, near-duplicates, and semantic plagiarism through a multi-signal pipeline of hashing, lexical overlap, and embeddings — with PII-aware ingestion and human-reviewable evidence reports.",
    stack: ["FastAPI", "Embeddings", "MinHash / LSH"],
  },
  {
    name: "Meeting AI",
    year: "2024",
    category: "AI Platform",
    blurb:
      "A meeting-intelligence platform that transcribes audio and generates structured minutes, summaries, and conversational Q&A using RAG over timestamped transcript segments, backed by PostgreSQL-native vector search.",
    stack: ["Python", "RAG", "pgvector", "Multi-LLM"],
  },
  {
    name: "pull-vids",
    year: "2026",
    category: "CLI Tool",
    blurb:
      "A universal video and audio downloader CLI built in Go — 1000+ sites, 360p to 4K, playlists and channels, progress bars, and cookie-auth bypass. Installable in one line via a Homebrew tap.",
    stack: ["Go", "FFmpeg", "Homebrew"],
    link: "https://github.com/vib795/pull-vids",
  },
  {
    name: "flaunt-github",
    year: "2026",
    category: "VS Code Extension",
    blurb:
      "A VS Code extension that turns every file save into a digital milestone — capturing your coding journey as a living, GitHub-style contribution chart.",
    stack: ["TypeScript", "VS Code API"],
    link: "https://github.com/vib795/flaunt-github",
  },
  {
    name: "always-decimal",
    year: "2025",
    category: "Python Package",
    blurb:
      "An open-source Python package on PyPI for safe conversion of floats, strings, and numbers into Decimal objects — resolving the numeric-comparison pitfalls between PostgreSQL values and Python floats.",
    stack: ["Python", "PyPI"],
    link: "https://pypi.org/project/always-decimal/",
  },
  {
    name: "everyday-developer-tools",
    year: "2024",
    category: "Web App",
    blurb:
      "A web app bundling 16+ everyday developer tools — JSON validators and schema generators, regex helpers, string and time utilities, encoding and fake-data tools, and Markdown ⇄ PDF conversion. A FastAPI backend exposes each tool as a typed JSON endpoint; a Vite + React frontend ships alongside it in a single Docker image.",
    stack: ["FastAPI", "React", "Docker"],
    link: "https://github.com/vib795/everyday-developer-tools",
  },
  {
    name: "copilot-anatomy",
    year: "2026",
    category: "Dev Tooling",
    blurb:
      "A reference implementation for configuring GitHub Copilot across a multi-model, polyglot team — every customisation primitive (instructions, prompts, skills, agents, chat modes) plus governance tooling. One script scaffolds the full .github/ structure into any repo, and an interactive browser visualisation maps how the pieces fit together.",
    stack: ["Shell", "GitHub Copilot", "HTML"],
    link: "https://github.com/vib795/copilot-anatomy",
  },
  {
    name: "copilot-howto",
    year: "2026",
    category: "Learning Guide",
    blurb:
      "A structured, visual, example-driven guide to mastering GitHub Copilot — 16 tutorial modules spanning every feature, from slash commands and custom instructions to skills, agents, MCP, and governance. Each module pairs Mermaid diagrams that explain how a feature works under the hood with copy-paste templates and a progressive beginner-to-advanced path.",
    stack: ["GitHub Copilot", "Mermaid", "Markdown"],
    link: "https://github.com/vib795/copilot-howto",
  },
];

export type Role = {
  role: string;
  company: string;
  period: string;
  summary: string;
  points: string[];
};

export const experience: Role[] = [
  {
    role: "Lead Engineer, AI & Platform",
    company: "EY",
    period: "Oct 2025 — Present",
    summary:
      "Designing agentic systems that automate enterprise infrastructure and onboarding.",
    points: [
      "Built the TerraCore Onboarding Agent — an agentic system using LLM tool-calling and multi-step orchestration to automate environment provisioning and account servicing.",
      "Exposed the agent as an async FastAPI service with streaming progress, coordinating Terraform, Jenkins, and account-servicing APIs as agent tools.",
      "Engineered guardrails — input validation, allow-listed actions, dry-run modes, and human-in-the-loop gates — for safe, auditable runs in regulated environments.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "EY",
    period: "Jan 2023 — Aug 2025",
    summary:
      "Led event-driven platforms and cloud-native modernization for Fidelity Institutional.",
    points: [
      "Led an event-driven microservices platform for Fidelity's Custom SMA business — advisor-driven onboarding, rebalancing, and compliance holds across AWS Lambda, EventBridge, and SQS.",
      "Delivered a cloud-native Mainframe Analysis Tool that maps retiring modules to their dependencies, cutting analysis from weeks to minutes.",
      "Strengthened data integrity and developer productivity with JSON schema validation, standardized git hooks, and a middleware tooling suite.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "EY",
    period: "Oct 2021 — Jan 2023",
    summary: "Modernized Fidelity's high-traffic recurring-investment platform.",
    points: [
      "Modernized the Periodic Investment Plan (PIP) — a consumer platform for recurring investing into mutual funds, ETFs, and equities.",
      "Built multi-step workflow orchestration on AWS Step Functions for periodic cash transfers and securities purchases at retail scale.",
      "Automated infrastructure with Terraform and CI/CD, and improved observability with Datadog logging, tracing, and alerts.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "EY",
    period: "Mar 2021 — Sep 2021",
    summary: "Built a securities-management platform from the ground up.",
    points: [
      "Built the source-of-truth platform for adding and removing securities and ticker symbols across enterprise systems.",
      "Led backend architecture, migrated SharePoint to PostgreSQL, and shipped CI/CD across AWS dev, QA, and production.",
    ],
  },
  {
    role: "Software Engineer",
    company: "HCL Technologies",
    period: "Jul 2014 — Nov 2018",
    summary:
      "Built resilient banking and insurance systems for a regulated financial exchange.",
    points: [
      "Developed and supported banking and insurance applications for a Texas Department of Insurance-regulated exchange.",
      "Automated incident handling with Python and Shell scripts, cutting response times and improving reliability.",
      "Led offshore teams in Manila and Chennai, achieving the lowest incident 'pain minutes' metric.",
    ],
  },
];

export const contact = {
  heading: { lead: "Let's build", tail: "something good." },
  body: "Have a project, a role, or an idea worth chasing? My inbox is open — I read everything and reply to most.",
};
