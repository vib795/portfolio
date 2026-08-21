// ════════════════════════════════════════════════════════════════════
//  SITE CONTENT
//  Real data sourced from Utkarsh's resume and GitHub. Edit this file
//  to update anything the portfolio displays.
// ════════════════════════════════════════════════════════════════════

export const profile = {
  name: "Utkarsh Singh",
  first: "Utkarsh",
  last: "Singh",
  role: "AI Engineer",
  location: "New York, NY",
  availability: "Open to new opportunities",
  email: "hello@singhcodes.dev",
  intro:
    "I'm an AI engineer with 11 years building production systems in financial services — now designing GenAI and agentic systems end to end, from RAG and eval harnesses to the CI that ships them.",
};


export const socials = [
  { label: "GitHub", url: "https://github.com/vib795" },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/connectwithutkarshsingh/",
  },
  { label: "Medium", url: "https://connectwithutkarshsingh.medium.com/" },
];

// Root-relative so these resolve from /blog and /blog/<slug> as well as the
// homepage, where the browser still treats them as same-page anchors.
export const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Writing", href: "/blog" },
];

export const marquee = [
  "Python",
  "FastAPI",
  "RAG",
  "Agentic AI",
  "Evals",
  "LangGraph",
  "LiteLLM",
  "Qdrant",
  "Neo4j",
  "OpenSearch",
  "AWS",
  "Kubernetes",
  "Kafka",
  "MCP",
];

export const about = {
  heading: { lead: "Eleven years of backend.", tail: "Now building agents." },
  paragraphs: [
    "I'm an AI engineer with 11 years building production backend systems in financial services — trading, money movement, and securities management — including four years embedded at Fidelity Investments as an EY consultant, delivering event-driven microservices and high-traffic investment platforms.",
    "Now I design and ship GenAI and agentic systems end to end: tool-calling agents, multi-step orchestration, and RAG with hybrid retrieval across dense, BM25, and graph signals. I build the evaluation harness that gates promotion — golden datasets, versioned baselines, regression gates — so every retrieval and model change is measured before it ships. I also lead AI enablement for 200+ engineers across the institutional vertical.",
  ],
  stack: [
    { label: "Languages", items: ["Python", "TypeScript", "Go", "Java", "SQL"] },
    {
      label: "GenAI & Agents",
      items: [
        "RAG",
        "Hybrid retrieval",
        "LangGraph",
        "CrewAI",
        "MCP",
        "LiteLLM",
        "OpenAI SDK",
      ],
    },
    {
      label: "Evaluation",
      items: [
        "Golden datasets",
        "Regression gates",
        "Guardrails",
        "PII-aware handling",
      ],
    },
    {
      label: "Backend",
      items: ["FastAPI", "asyncio", "Kafka", "SSE streaming", "Microservices"],
    },
    {
      label: "Infra & Data",
      items: [
        "AWS",
        "Kubernetes",
        "Terraform",
        "PostgreSQL",
        "Qdrant",
        "Neo4j",
        "OpenSearch",
      ],
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
    name: "Agent Memory",
    year: "2026",
    category: "npm Package",
    blurb:
      "Durable cross-repo memory for Claude Code, GitHub Copilot, and Codex. Each client engagement is a separate store rather than a filtered view, so one engagement's notes are unreachable from another even by exact id. Knowledge exports at global scope by default — what you learned travels between machines, the client's architecture does not. Zero runtime and zero dev dependencies, asserted in CI and published to npm with Sigstore provenance attestation.",
    stack: ["Node.js", "node:sqlite", "Agent Skills"],
    link: "https://www.npmjs.com/package/@vib795/agent-memory",
  },
  {
    name: "Code Analyzer",
    year: "2025",
    category: "RAG Platform",
    blurb:
      "A code-intelligence platform that ingests and queries large multi-repository codebases — 600+ repos at its first engagement — to power software-engineering audits. A tri-store backbone pairs Qdrant for dense semantic search, Neo4j for call graphs and symbol references, and OpenSearch for BM25 exact-match on the rare identifier tokens embeddings handle worst, fused with Reciprocal Rank Fusion and cross-encoder reranking.",
    stack: ["Python", "Qdrant", "Neo4j", "OpenSearch", "LiteLLM"],
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
    name: "Costco Price Match",
    year: "2026",
    category: "AI Agent",
    blurb:
      "An AI agent that scans Costco receipts, cross-references each line item against active deals and temporary price drops, and emails a weekly price-adjustment report. Receipt parsing runs on Amazon Nova; the weekly run is an AgentCore Runtime triggered by EventBridge. Ships with a native SwiftUI companion app — CostScanner — on the App Store.",
    stack: ["AWS Lambda", "Amazon Nova", "AgentCore", "SwiftUI"],
    link: "https://github.com/vib795/costco-price-match",
  },
  {
    name: "Yantra: Second Brain",
    year: "2026",
    category: "iOS App",
    blurb:
      "A native iOS app for capturing voice memos, notes, journals, meeting recordings, photos, and saved URLs — then chatting with them. Transcription, embeddings, and summarization all run on-device via Apple Speech, NLEmbedding, and iOS 26 Foundation Models; only the retrieved snippets and the question leave, sent under the user's own Anthropic key through a stateless proxy that persists nothing. Captures English, Hindi, and Hinglish with translation.",
    stack: ["SwiftUI", "Apple Speech", "Foundation Models", "Anthropic"],
    link: "https://apps.apple.com/us/app/yantra-second-brain/id6775635658",
  },
  {
    name: "Passport Tool iOS",
    year: "2026",
    category: "iOS App",
    blurb:
      "A fully on-device iOS app for preparing VFS Global / Passport Seva compliant Indian passport photos. Apple's Vision framework handles face detection, real-human verification, and background segmentation, with Core Image for cropping and tone — a SwiftUI port of the Python/OpenCV web original with zero backend.",
    stack: ["SwiftUI", "Vision", "Core Image"],
    link: "https://apps.apple.com/us/app/india-passport-photo-seva/id6776499863",
  },
  {
    name: "Meeting AI",
    year: "2024",
    category: "AI Platform",
    blurb:
      "A meeting-intelligence platform that transcribes audio and generates structured minutes, summaries, and conversational Q&A using RAG over timestamped transcript segments, backed by PostgreSQL-native vector search. Inference sits behind a model-agnostic layer spanning OpenAI, Claude, Gemini, DeepSeek, Hugging Face, and Ollama, so quality can be benchmarked against cost and latency on noisy long-form audio.",
    stack: ["Python", "RAG", "pgvector", "Multi-LLM"],
  },
  {
    name: "Pull Vids",
    year: "2026",
    category: "CLI Tool",
    blurb:
      "A universal video and audio downloader CLI built in Go — 1000+ sites, 360p to 4K, playlists and channels, progress bars, and cookie-auth bypass. One of three Go CLIs, alongside convert-vid and epub2pdf, installable in one line from a shared Homebrew tap.",
    stack: ["Go", "FFmpeg", "Homebrew"],
    link: "https://github.com/vib795/pull-vids",
  },
  {
    name: "Flaunt GitHub",
    year: "2026",
    category: "VS Code Extension",
    blurb:
      "A VS Code extension that turns every file save into a digital milestone — capturing your coding journey as a living, GitHub-style contribution chart.",
    stack: ["TypeScript", "VS Code API"],
    link: "https://marketplace.visualstudio.com/items?itemName=UtkarshSingh.flaunt-github",
  },
  {
    name: "Always Decimal",
    year: "2025",
    category: "Python Package",
    blurb:
      "An open-source Python package on PyPI for safe conversion of floats, strings, and numbers into Decimal objects — resolving the numeric-comparison pitfalls between PostgreSQL values and Python floats.",
    stack: ["Python", "PyPI"],
    link: "https://pypi.org/project/always-decimal/",
  },
  {
    name: "Everyday Developer Tools",
    year: "2024",
    category: "Web App",
    blurb:
      "A web app bundling 16+ everyday developer tools — JSON validators and schema generators, regex helpers, string and time utilities, encoding and fake-data tools, and Markdown ⇄ PDF conversion. A FastAPI backend exposes each tool as a typed JSON endpoint; a Vite + React frontend ships alongside it in a single Docker image.",
    stack: ["FastAPI", "React", "Docker"],
    link: "https://wrench.tools",
  },
  {
    name: "Feast Factor",
    year: "2024",
    category: "Web App",
    blurb:
      "A macro calculator for weight-loss and fitness goals — it turns age, weight, height, and activity level into daily protein, carb, fat, and calorie targets to plan meals against. A responsive Next.js app deployed on Vercel.",
    stack: ["Next.js", "React", "Vercel"],
    link: "https://feastfactor.xyz",
  },
  {
    name: "Copilot Anatomy",
    year: "2026",
    category: "Dev Tooling",
    blurb:
      "A reference implementation for configuring GitHub Copilot across a multi-model, polyglot team — every customisation primitive (instructions, prompts, skills, agents, chat modes) plus governance tooling. One script scaffolds the full .github/ structure into any repo, and an interactive browser visualisation maps how the pieces fit together.",
    stack: ["Shell", "GitHub Copilot", "HTML"],
    link: "https://vib795.github.io/copilot-anatomy/",
  },
  {
    name: "Copilot How To",
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
  client?: string; // consulting engagement — omitted for direct employment
  period: string;
  summary: string;
  points: string[];
};

export const experience: Role[] = [
  {
    role: "Lead Engineer, AI & Platform",
    company: "EY",
    period: "Aug 2025 — Present",
    summary:
      "Building the retrieval platform behind engineering audits, and the agents that automate enterprise onboarding.",
    points: [
      "Built Code-Analyzer, a code-intelligence platform that makes large commercial financial-services codebases auditable on a consulting timeline, treating retrieval over code as a problem distinct from retrieval over prose.",
      "Built the evaluation harness that gates promotion — 30 hand-curated Q&A pairs across 15 indexed repositories, scored on keyword recall, file-pattern hit rate, cross-module recall, and citation rate against a versioned baseline. Hybrid retrieval holds 73% keyword recall at 520 ms, with 100% of answers citing sources.",
      "Designed the TerraCore Onboarding Agent — an agentic system driving Terraform, Jenkins, and account-servicing APIs as LLM tools, cutting application onboarding from weeks to hours with resumable, auditable workflow state.",
      "Shipped the agent as an async FastAPI service with SSE progress streaming, and made destructive infrastructure operations safe to automate through input validation, allow-listed actions, dry-run modes, and human-in-the-loop approval gates.",
      "Leads AI enablement for 200+ engineers across the institutional vertical, covering agentic frameworks and org-scale GitHub Copilot adoption.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "EY",
    client: "Fidelity Investments",
    period: "Jan 2023 — Aug 2025",
    summary:
      "Led event-driven platforms and cloud-native modernization for Fidelity Institutional.",
    points: [
      "Led design and delivery of an event-driven microservices platform for Fidelity Institutional's Custom Separately Managed Accounts, launching with 200–500 high-value institutional accounts representing roughly $1B in assets under management.",
      "Delivered a cloud-native Mainframe Analysis Tool that automatically maps dependencies across thousands of modules spanning COBOL, JCL, PL/I, CICS, IMS, and DLI — cutting retirement-impact analysis from weeks to minutes and replacing manual lookups for analysts.",
      "Architected distributed workflows across AWS Lambda, EventBridge, and SQS for trade allocations, securities servicing, and cash movements; provisioned environments with Terraform and hardened data integrity with JSON schema validation and standardized git hooks.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "EY",
    client: "Fidelity Investments",
    period: "Oct 2021 — Jan 2023",
    summary: "Modernized Fidelity's high-traffic retail investing platform.",
    points: [
      "Modernized Fidelity's retail investing platform across the Periodic Investment Plan, baskets, and the 52-Week Challenge, letting consumers automatically invest from external bank accounts into mutual funds, ETFs, and equities on weekly, bi-weekly, and monthly schedules.",
      "Built multi-step workflow orchestration on AWS Step Functions for periodic cash transfers, securities purchases, and fund allocations.",
      "Automated infrastructure with Terraform, added CI/CD, and instrumented Datadog logging, tracing, metrics, and alerting for high-volume investment flows.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "EY",
    client: "Capital Group",
    period: "Mar 2021 — Sep 2021",
    summary: "Built a securities-management platform from the ground up.",
    points: [
      "Built the source-of-truth platform for adding and removing securities and ticker symbols across enterprise systems.",
      "Migrated SharePoint to PostgreSQL, containerized services, and shipped CI/CD across AWS dev, QA, and production.",
    ],
  },
  {
    role: "Cloud Engineer (Intern)",
    company: "Healthcare Triangle Inc.",
    period: "May 2020 — Mar 2021",
    summary:
      "Designed AWS migration strategies for regulated healthcare workloads.",
    points: [
      "Partnered with client stakeholders to design AWS migration strategies for enterprise healthcare workloads, enabling secure and scalable adoption of managed services for regulated health data.",
    ],
  },
  {
    role: "Software Engineer",
    company: "HCL Technologies",
    period: "Jul 2014 — Nov 2018",
    summary:
      "Built resilient banking and insurance systems for a regulated financial exchange.",
    points: [
      "Built and supported banking and insurance applications for a Texas Department of Insurance-regulated financial exchange, owning critical production incidents and 24x7 batch processing.",
      "Automated incident handling and alerting with Python and Shell, feeding an Angular monitoring dashboard; built reconciliation jobs to maintain data accuracy across enterprise member-data utilities.",
      "Led offshore teams in Manila and Chennai and achieved the lowest incident 'pain minutes' metric in the organization; delivered across COBOL, PL/I, JCL, Java, Python, and Datastage, including IMS to UDB migration pipelines.",
    ],
  },
];

export type Credential = {
  title: string;
  org: string;
  period: string;
};

export const education: Credential[] = [
  {
    title: "M.S., Computer Science",
    org: "University of Texas at San Antonio",
    period: "2019 — 2020",
  },
  {
    title: "B.E., Computer Science and Engineering",
    org: "Visvesvaraya Technological University",
    period: "2009 — 2013",
  },
];

export const certifications = [
  "Databricks Accredited Generative AI Fundamentals",
  "Developing Serverless Solutions on AWS",
];

export const contact = {
  heading: { lead: "Let's build", tail: "something good." },
  body: "Have a project, a role, or an idea worth chasing? My inbox is open — I read everything and reply to most.",
  calendly: "https://calendly.com/connect-with-utkarsh-singh/30min",
};
