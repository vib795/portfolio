// ════════════════════════════════════════════════════════════════════
//  SITE CONTENT
//  Real data sourced from Utkarsh's resume and GitHub. Edit this file
//  to update anything the portfolio displays.
// ════════════════════════════════════════════════════════════════════

export const profile = {
  name: "Utkarsh Singh",
  first: "Utkarsh",
  last: "Singh",
  /**
   * The nav wordmark beside the US badge. Deliberately not `first`: that
   * feeds `givenName` in the Person schema (lib/schema.ts) and the PWA
   * short name (app/manifest.ts), both of which must stay the real given
   * name. This is the brand handle, and it matches the domain.
   */
  handle: "singhcodes",
  role: "AI Engineer",
  location: "United States",
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
  { label: "Play", href: "/#play" },
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
  heading: { lead: "11 years of backend.", tail: "Now building agents." },
  paragraphs: [
    "I'm an AI engineer with 11 years building production systems in financial services, four of those years embedded at Fidelity Investments as an EY consultant: event-driven microservices, an institutional managed-accounts platform holding ~$1B in assets, and a high-traffic retail investing platform.",
    "Now I build GenAI and agentic systems end to end: an agentic onboarding system that took application provisioning from a sprint's worth of work to hours, GitHub Copilot enablement for 200+ developers, Copilot skills adopted across a 300+ person client vertical, and Code-Analyzer, a code-intelligence platform for auditing large codebases.",
    "I own the whole path, from RAG architecture and the eval harness that gates every change, through Python services and AWS event-driven infrastructure, to the CI that ships it.",
  ],
  stack: [
    { label: "Languages", items: ["Python", "Go", "Java", "TypeScript", "SQL"] },
    {
      label: "GenAI & Agents",
      items: [
        "RAG",
        "Hybrid retrieval",
        "Reranking",
        "Tool-calling agents",
        "MCP",
        "GitHub Copilot",
        "LangGraph",
        "LiteLLM",
        "Pydantic",
      ],
    },
    {
      label: "Evaluation",
      items: [
        "Golden datasets",
        "Retrieval metrics",
        "Regression gates",
        "Guardrails",
        "Human-in-the-loop",
        "PII-aware handling",
      ],
    },
    {
      label: "Backend",
      items: ["FastAPI", "asyncio", "Spring Boot", "Microservices", "SSE streaming"],
    },
    {
      label: "Infra & Data",
      items: [
        "AWS",
        "Terraform",
        "Kubernetes",
        "Kafka",
        "PostgreSQL",
        "Qdrant",
        "Neo4j",
        "OpenSearch",
      ],
    },
    {
      label: "Delivery",
      items: ["GitHub Actions", "Datadog", "Splunk", "Sigstore provenance"],
    },
  ],
};

/** The four facets the work grid filters on. "All" is a UI-only value. */
/* Featured leads and is the default view — a first-time reader should
   meet the four projects that actually carry the claim on the tin,
   not an undifferentiated wall of fourteen. "All" sits last, as the
   escape hatch it is.

   Featured is orthogonal to the rest: a project has exactly one facet
   and may separately be featured, so Agent Memory can be an AI system
   and a headline at the same time. */
export const workFacets = [
  "Featured",
  "AI Systems",
  "Open Source",
  "Apps",
  "All",
] as const;
export type WorkFacet = (typeof workFacets)[number];

/** One cell of a project card's 2x2 stat block. */
export type Stat = { value: string; label: string };

export type Project = {
  name: string;
  year: string;
  category: string;
  /** Which filter pill this project answers to. */
  /** The one bucket this project belongs to. */
  facet: Exclude<WorkFacet, "All" | "Featured">;
  /** Shown under the Featured tab, whatever its facet. */
  featured?: boolean;
  /** Exactly four, rendered as the card's 2x2 stat grid. */
  stats: Stat[];
  blurb: string;
  stack: string[];
  link?: string; // public URL — omitted for internal / private work
};

export const projects: Project[] = [
  {
    name: "Agent Memory",
    year: "2026",
    category: "npm Package",
    featured: true,
    facet: "AI Systems",
    stats: [
      { value: "0", label: "Runtime deps" },
      { value: "113", label: "Tests" },
      { value: "12", label: "CI jobs" },
      { value: "Sigstore", label: "Provenance" },
    ],
    blurb:
      "Durable cross-repo memory for Claude Code, GitHub Copilot, and Codex. Each client engagement is a separate store rather than a filtered view, so one engagement's notes are unreachable from another even by exact id. Knowledge exports at global scope by default — what you learned travels between machines, the client's architecture does not. Zero runtime and zero dev dependencies, asserted in CI and published to npm with Sigstore provenance attestation.",
    stack: ["Node.js", "node:sqlite", "Agent Skills"],
    link: "https://www.npmjs.com/package/@vib795/agent-memory",
  },
  {
    name: "Code Analyzer",
    year: "2025",
    category: "RAG Platform · PoC",
    featured: true,
    facet: "AI Systems",
    stats: [
      { value: "73%", label: "Keyword recall" },
      { value: "516ms", label: "Latency" },
      { value: "15", label: "Repos in eval" },
      { value: "3", label: "Retrieval stores" },
    ],
    blurb:
      "A proof-of-concept code-intelligence platform, inspired by a software audit, that makes large unfamiliar codebases auditable on a consulting timeline. Tree-sitter and SCIP parsing chunk on AST boundaries; a tri-store backbone pairs Qdrant for dense semantic search, Neo4j for call graphs and symbol references, and OpenSearch BM25 for the rare identifier tokens embeddings handle worst, fused with Reciprocal Rank Fusion and cross-encoder reranking. An eval harness of 30 hand-curated questions across 15 public repositories gates every retrieval, chunking, and model change.",
    stack: ["Python", "Qdrant", "Neo4j", "OpenSearch", "LiteLLM"],
  },
  {
    name: "Resume Screener",
    year: "2025",
    category: "AI System",
    facet: "AI Systems",
    stats: [
      { value: "3", label: "Signal layers" },
      { value: "LSH", label: "Near-duplicate" },
      { value: "PII", label: "Aware ingest" },
      { value: "FastAPI", label: "Runtime" },
    ],
    blurb:
      "An AI resume-evaluation system on FastAPI that flags exact duplicates, near-duplicates, and semantic plagiarism through a multi-signal pipeline of hashing, lexical overlap, and embeddings — with PII-aware ingestion and human-reviewable evidence reports.",
    stack: ["FastAPI", "Embeddings", "MinHash / LSH"],
  },
  {
    name: "Costco Price Match",
    year: "2026",
    category: "AI Agent",
    featured: true,
    facet: "AI Systems",
    stats: [
      { value: "Nova", label: "Receipt parsing" },
      { value: "Weekly", label: "Run cadence" },
      { value: "AgentCore", label: "Runtime" },
      { value: "App Store", label: "Companion" },
    ],
    blurb:
      "An AI agent that scans Costco receipts, cross-references each line item against active deals and temporary price drops, and emails a weekly price-adjustment report. Receipt parsing runs on Amazon Nova; the weekly run is an AgentCore Runtime triggered by EventBridge. Ships with a native SwiftUI companion app — CostScanner — on the App Store.",
    stack: ["AWS Lambda", "Amazon Nova", "AgentCore", "SwiftUI"],
    link: "https://github.com/vib795/costco-price-match",
  },
  {
    name: "Yantra: Second Brain",
    year: "2026",
    category: "iOS App",
    featured: true,
    facet: "Apps",
    stats: [
      { value: "3", label: "Languages" },
      { value: "100%", label: "On-device NLP" },
      { value: "iOS 26", label: "Foundation Models" },
      { value: "0", label: "Bytes retained" },
    ],
    blurb:
      "A native iOS app for capturing voice memos, notes, journals, meeting recordings, photos, and saved URLs — then chatting with them. Transcription, embeddings, and summarization all run on-device via Apple Speech, NLEmbedding, and iOS 26 Foundation Models; only the retrieved snippets and the question leave, sent under the user's own Anthropic key through a stateless proxy that persists nothing. Captures English, Hindi, and Hinglish with translation.",
    stack: ["SwiftUI", "Apple Speech", "Foundation Models", "Anthropic"],
    link: "https://apps.apple.com/us/app/yantra-second-brain/id6775635658",
  },
  {
    name: "Passport Tool iOS",
    year: "2026",
    category: "iOS App",
    facet: "Apps",
    stats: [
      { value: "100%", label: "On-device" },
      { value: "0", label: "Backend" },
      { value: "Vision", label: "Face detection" },
      { value: "App Store", label: "Shipped" },
    ],
    blurb:
      "A fully on-device iOS app for preparing VFS Global / Passport Seva compliant Indian passport photos. Apple's Vision framework handles face detection, real-human verification, and background segmentation, with Core Image for cropping and tone — a SwiftUI port of the Python/OpenCV web original with zero backend.",
    stack: ["SwiftUI", "Vision", "Core Image"],
    link: "https://apps.apple.com/us/app/india-passport-photo-seva/id6776499863",
  },
  {
    name: "Meeting AI",
    year: "2024",
    category: "AI Platform",
    facet: "AI Systems",
    stats: [
      { value: "6", label: "Model providers" },
      { value: "RAG", label: "Timestamped" },
      { value: "pgvector", label: "Vector store" },
      { value: "Q&A", label: "Conversational" },
    ],
    blurb:
      "A meeting-intelligence platform that transcribes audio and generates structured minutes, summaries, and conversational Q&A using RAG over timestamped transcript segments, backed by PostgreSQL-native vector search. Inference sits behind a model-agnostic layer spanning OpenAI, Claude, Gemini, DeepSeek, Hugging Face, and Ollama, so quality can be benchmarked against cost and latency on noisy long-form audio.",
    stack: ["Python", "RAG", "pgvector", "Multi-LLM"],
  },
  {
    name: "Pull Vids",
    year: "2026",
    category: "CLI Tool",
    facet: "Open Source",
    stats: [
      { value: "1000+", label: "Sites" },
      { value: "4K", label: "Max quality" },
      { value: "3", label: "Go CLIs" },
      { value: "Homebrew", label: "Tap" },
    ],
    blurb:
      "A universal video and audio downloader CLI built in Go — 1000+ sites, 360p to 4K, playlists and channels, progress bars, and cookie-auth bypass. One of three Go CLIs, alongside convert-vid and epub2pdf, installable in one line from a shared Homebrew tap.",
    stack: ["Go", "FFmpeg", "Homebrew"],
    link: "https://github.com/vib795/pull-vids",
  },
  {
    name: "Flaunt GitHub",
    year: "2026",
    category: "VS Code Extension",
    facet: "Open Source",
    stats: [
      { value: "VS Code", label: "Marketplace" },
      { value: "Per-save", label: "Capture" },
      { value: "TypeScript", label: "Built in" },
      { value: "Chart", label: "Contribution" },
    ],
    blurb:
      "A VS Code extension that turns every file save into a digital milestone — capturing your coding journey as a living, GitHub-style contribution chart.",
    stack: ["TypeScript", "VS Code API"],
    link: "https://marketplace.visualstudio.com/items?itemName=UtkarshSingh.flaunt-github",
  },
  {
    name: "Always Decimal",
    year: "2025",
    category: "Python Package",
    facet: "Open Source",
    stats: [
      { value: "PyPI", label: "Published" },
      { value: "Decimal", label: "Safe casts" },
      { value: "Postgres", label: "Float parity" },
      { value: "Python", label: "Package" },
    ],
    blurb:
      "An open-source Python package on PyPI for safe conversion of floats, strings, and numbers into Decimal objects — resolving the numeric-comparison pitfalls between PostgreSQL values and Python floats.",
    stack: ["Python", "PyPI"],
    link: "https://pypi.org/project/always-decimal/",
  },
  {
    name: "Salt (SaltStack)",
    year: "2026",
    category: "Upstream Contribution",
    facet: "Open Source",
    stats: [
      { value: "10×", label: "Inflation fixed" },
      { value: "K–Y", label: "SI units corrected" },
      { value: "Merged", label: "Upstream" },
      { value: "pytest", label: "Parametrized tests" },
    ],
    blurb:
      "A merged upstream fix to Salt: AIX disk.iostat readings were inflated 10× (1.0K parsed as 10,000). Fixed every SI-unit multiplier, K through Y, in the disk module's shared number parser (10E3 → 1E3), with parametrized unit tests added after maintainer review.",
    stack: ["Python", "Salt", "pytest"],
    link: "https://github.com/saltstack/salt/pull/65543",
  },
  {
    name: "Everyday Developer Tools",
    year: "2024",
    category: "Web App",
    facet: "Apps",
    stats: [
      { value: "16+", label: "Tools" },
      { value: "1", label: "Docker image" },
      { value: "FastAPI", label: "Backend" },
      { value: "Live", label: "wrench.tools" },
    ],
    blurb:
      "A web app bundling 16+ everyday developer tools — JSON validators and schema generators, regex helpers, string and time utilities, encoding and fake-data tools, and Markdown ⇄ PDF conversion. A FastAPI backend exposes each tool as a typed JSON endpoint; a Vite + React frontend ships alongside it in a single Docker image.",
    stack: ["FastAPI", "React", "Docker"],
    link: "https://wrench.tools",
  },
  {
    name: "Feast Factor",
    year: "2024",
    category: "Web App",
    facet: "Apps",
    stats: [
      { value: "4", label: "Macro targets" },
      { value: "Next.js", label: "Stack" },
      { value: "Vercel", label: "Deployed" },
      { value: "Responsive", label: "Layout" },
    ],
    blurb:
      "A macro calculator for weight-loss and fitness goals — it turns age, weight, height, and activity level into daily protein, carb, fat, and calorie targets to plan meals against. A responsive Next.js app deployed on Vercel.",
    stack: ["Next.js", "React", "Vercel"],
    link: "https://feastfactor.xyz",
  },
  {
    name: "Copilot Anatomy",
    year: "2026",
    category: "Dev Tooling",
    facet: "Open Source",
    stats: [
      { value: "84", label: "Skills" },
      { value: "59", label: "Agent files" },
      { value: "8", label: "CI governance checks" },
      { value: "Plugin", label: "Agent packaging" },
    ],
    blurb:
      "An open-source reference for governed GitHub Copilot at team scale, covering every customisation primitive in one place: 84 skills, 59 agent files, path-scoped instructions, hooks, MCP configuration, and Agent Plugin packaging. Eight CI governance checks keep it honest, and a model-compatibility file tracks model retirements. Copilot How To is the companion 16-module tutorial.",
    stack: ["Shell", "GitHub Copilot", "HTML"],
    link: "https://vib795.github.io/copilot-anatomy/",
  },
  {
    name: "Copilot How To",
    year: "2026",
    category: "Learning Guide",
    facet: "Open Source",
    stats: [
      { value: "16", label: "Modules" },
      { value: "Mermaid", label: "Diagrams" },
      { value: "Templates", label: "Copy-paste" },
      { value: "Beginner+", label: "Progressive path" },
    ],
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
    role: "Software Engineering Manager, AI & Platform",
    company: "EY",
    client: "Financial-services client",
    period: "Aug 2025 — Present",
    summary:
      "Manager, Technology Consulting at EY since Aug 2024. Building the retrieval platform behind engineering audits, the agents that automate application onboarding, and the Copilot tooling a 300+ person vertical runs on.",
    points: [
      "Built Code-Analyzer (proof of concept), a code-intelligence platform that makes large, unfamiliar codebases auditable on a consulting timeline. It treats retrieval over code as its own problem: tree-sitter and SCIP parsing chunk on AST boundaries rather than token windows, behind a per-client chunking registry with structural isolation between clients.",
      "Architected a tri-store retrieval backbone: Qdrant for dense semantic search, Neo4j for call graphs, imports, and symbol references, and OpenSearch BM25 for the rare identifier tokens embeddings handle worst. Results are fused with Reciprocal Rank Fusion and cross-encoder reranking, and LLM synthesis is routed through LiteLLM so models swap across OpenAI, Claude, Gemini, and open-source providers without touching the pipeline.",
      "Built the evaluation harness that gates promotion: 30 hand-curated questions across 15 public repositories, scored on keyword recall, file-pattern hit rate, cross-module recall, and citation rate against a versioned baseline. Hybrid retrieval holds 73% keyword recall at 516 ms, with every answer citing its sources.",
      "Cut application onboarding from a sprint's worth of work to hours with the TerraCore Onboarding Agent: a GitHub Copilot reusable prompt whose Python-backed skills raise each request through the owning teams' APIs in a fixed order, with calls that are safe to repeat and a stop for a person wherever credentials are involved. Shared across teams through MCP.",
      "Brought Copilot tooling to the client's 300+ person FI vertical: the onboarding agent, Jira and Confluence skills that let BSAs create stories in bulk, and report-generation automation for QA.",
      "Enabled 200+ EY developers on GitHub Copilot through shared instructions, custom agents and skills, multi-model routing, hands-on labs, and office hours.",
    ],
  },
  {
    role: "Lead Engineer",
    company: "EY",
    client: "Fidelity Investments",
    period: "Jan 2023 — Aug 2025",
    summary:
      "Led event-driven platforms and mainframe modernization for Fidelity.",
    points: [
      "Cut mainframe retirement-impact analysis for Fidelity's PI business from months to minutes across thousands of modules (COBOL, JCL, PL/I, CICS, IMS, DLI) by leading a cloud-native Mainframe Analysis Tool in Go that maps dependencies as a PostgreSQL graph; later added Gemini to explain modules.",
      "Launched Fidelity Institutional's Custom Separately Managed Accounts platform with 200–500 high-value institutional accounts (~$1B AUM), leading event-driven microservices for advisor-driven onboarding, portfolio updates, compliance holds, terminations, and rebalancing.",
      "Hardened trade allocations, securities servicing, and cash movements against malformed payloads with AWS Lambda workflows on EventBridge and SQS, provisioned with Terraform and guarded by JSON schema validation and standardized git hooks.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "EY",
    client: "Fidelity Investments",
    period: "Oct 2021 — Jan 2023",
    summary: "Modernized Fidelity's high-traffic retail investing platform.",
    points: [
      "Let consumers auto-invest from external bank accounts into mutual funds, ETFs, and equities on weekly, bi-weekly, and monthly schedules by modernizing the platform across the Periodic Investment Plan, baskets, and the 52-Week Challenge.",
      "Made high-volume periodic cash transfers, securities purchases, and fund allocations observable end to end with multi-step orchestration on AWS Step Functions, Terraform, CI/CD, and Datadog logging, tracing, metrics, and alerting.",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "EY",
    client: "Capital Group",
    period: "Mar 2021 — Sep 2021",
    summary: "Built a securities-management platform from scratch.",
    points: [
      "Built the platform that became Capital Group's source of truth for adding and removing securities and ticker symbols across enterprise platforms.",
      "Migrated SharePoint to PostgreSQL, containerized services, and shipped CI/CD across AWS dev, QA, and production.",
    ],
  },
  {
    role: "Cloud DevOps Engineer",
    company: "Healthcare Triangle Inc.",
    period: "Nov 2020 — Mar 2021",
    summary: "Planned compliant AWS migrations for regulated health data.",
    points: [
      "Designed migration strategies with client stakeholders to move enterprise healthcare workloads onto AWS managed services in compliance with health-data regulations.",
    ],
  },
  {
    role: "Information Technology Intern",
    company: "Healthcare Triangle Inc.",
    period: "Jun 2020 — Aug 2020",
    summary: "Supported client workload and application migrations to AWS.",
    points: [
      "Supported client workload and application migrations to AWS.",
    ],
  },
  {
    role: "Software Engineer",
    company: "HCL Technologies",
    period: "Jun 2014 — Nov 2018",
    summary:
      "Kept a regulated financial exchange's banking and insurance systems running, in India and Mexico.",
    points: [
      "Kept a Texas Department of Insurance-regulated financial exchange's banking and insurance applications running through 24x7 operations, owning critical production incidents and batch processing.",
      "Saved $35,000 a year in manual effort and cut incident response time by automating incident handling and alerting in Python and Shell, feeding an Angular monitoring dashboard; built reconciliation jobs to keep member-data utilities accurate.",
      "Achieved the organization's lowest 'pain minutes per team' incident metric leading offshore teams in Manila and Chennai across COBOL, PL/I, JCL, Java, Python, and Datastage, including IMS to UDB migration pipelines.",
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

export const book = {
  title: "The Permission Stack",
  subtitle: "Engineering Production AI Inside Regulated Enterprises",
  status:
    "A complete 300-page, 12-chapter draft. Publisher proposals are underway.",
};

export const contact = {
  heading: { lead: "Let's build", tail: "something good." },
  body: "Have a project, a role, or an idea worth chasing? My inbox is open — I read everything and reply to most.",
  calendly: "https://calendly.com/connect-with-utkarsh-singh/30min",
};
