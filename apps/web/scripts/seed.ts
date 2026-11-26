import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../src/models/User";
import { Company } from "../src/models/Company";
import { Job } from "../src/models/Job";
import { Quiz } from "../src/models/Quiz";
import { QuizAttempt } from "../src/models/QuizAttempt";
import { Resume } from "../src/models/Resume";
import { Application } from "../src/models/Application";
import { AiSettings } from "../src/models/AiSettings";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/autorecruit";

async function main() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  console.log("Cleaning existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Quiz.deleteMany({}),
    QuizAttempt.deleteMany({}),
    Resume.deleteMany({}),
    Application.deleteMany({}),
    AiSettings.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("password123", 10);
  const adminHash = await bcrypt.hash(process.env.PLATFORM_ADMIN_PASSWORD || "admin1234", 10);

  // 1. Platform Admin
  await User.create({
    name: "Platform Admin",
    email: process.env.PLATFORM_ADMIN_EMAIL || "admin@autorecruit.local",
    passwordHash: adminHash,
    role: "PLATFORM_ADMIN",
  });

  // 2. Real Tech Companies
  const companiesData = [
    {
      name: "Stripe",
      slug: "stripe",
      website: "https://stripe.com",
      logoText: "ST",
      logoUrl: "https://images.ctfassets.net/f60q1anpxzid/stripe-logo/stripe-icon.png",
      logoBg: "#635BFF",
      industry: "Fintech & Payments",
      location: "San Francisco, CA (Remote)",
      about: "Stripe is a financial infrastructure platform for businesses. Millions of companies use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.",
    },
    {
      name: "Vercel",
      slug: "vercel",
      website: "https://vercel.com",
      logoText: "▲",
      logoBg: "#000000",
      industry: "Developer Tools",
      location: "San Francisco, CA (Remote)",
      about: "Vercel provides developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web. Creators of Next.js.",
    },
    {
      name: "Linear",
      slug: "linear",
      website: "https://linear.app",
      logoText: "LN",
      logoBg: "#5E6AD2",
      industry: "Productivity & Software",
      location: "San Francisco, CA (Remote)",
      about: "Linear is a purpose-built tool for planning and building products. Streamline issues, projects, and product roadmaps with unprecedented speed.",
    },
    {
      name: "Figma",
      slug: "figma",
      website: "https://figma.com",
      logoText: "FG",
      logoBg: "#F24E1E",
      industry: "Design & Collaboration",
      location: "San Francisco, CA",
      about: "Figma connects everyone in the design process so teams can deliver better products, faster. The leading collaborative interface design platform.",
    },
    {
      name: "Notion",
      slug: "notion",
      website: "https://notion.so",
      logoText: "N",
      logoBg: "#111111",
      industry: "Productivity & AI",
      location: "San Francisco, CA (Remote)",
      about: "Notion is the all-in-one connected workspace where teams plan, write, and organize with integrated artificial intelligence.",
    },
    {
      name: "Supabase",
      slug: "supabase",
      website: "https://supabase.com",
      logoText: "⚡",
      logoBg: "#3ECF8E",
      industry: "Database & Cloud",
      location: "Singapore (Remote)",
      about: "Supabase is an open source Firebase alternative providing Postgres databases, Authentication, instant APIs, Edge Functions, and Vector embeddings.",
    },
    {
      name: "Datadog",
      slug: "datadog",
      website: "https://datadoghq.com",
      logoText: "DD",
      logoBg: "#632CA6",
      industry: "Cloud Observability",
      location: "New York, NY (Remote)",
      about: "Datadog is an observability and security platform for cloud applications. We provide monitoring for servers, databases, tools, and services through a SaaS platform.",
    },
    {
      name: "Brex",
      slug: "brex",
      website: "https://brex.com",
      logoText: "BX",
      logoBg: "#F36523",
      industry: "Corporate Finance",
      location: "San Francisco, CA (Remote)",
      about: "Brex empowers growing businesses with corporate credit cards, expense management software, and banking solutions designed for hyper-scale.",
    },
    {
      name: "Ramp",
      slug: "ramp",
      website: "https://ramp.com",
      logoText: "RP",
      logoBg: "#2BB673",
      industry: "Financial Automation",
      location: "New York, NY (Remote)",
      about: "Ramp is the finance automation platform designed to save businesses time and money. Corporate cards, bill pay, vendor management, and accounting automation.",
    },
    {
      name: "Anthropic",
      slug: "anthropic",
      website: "https://anthropic.com",
      logoText: "AN",
      logoBg: "#CC785C",
      industry: "Artificial Intelligence",
      location: "San Francisco, CA",
      about: "Anthropic is an AI safety and research company that builds reliable, interpretable, and steerable AI systems. Creators of Claude.",
    },
    {
      name: "Retool",
      slug: "retool",
      website: "https://retool.com",
      logoText: "RT",
      logoBg: "#3D5A80",
      industry: "Internal Tools",
      location: "San Francisco, CA (Remote)",
      about: "Retool is the fast way to build internal software. Build business applications with UI building blocks, connected to any database and API.",
    },
    {
      name: "Raycast",
      slug: "raycast",
      website: "https://raycast.com",
      logoText: "RC",
      logoBg: "#FF6363",
      industry: "Developer Utilities",
      location: "London, UK (Remote)",
      about: "Raycast is an extensible launcher that lets you complete tasks, calculate, share common links, and interact with tools in milliseconds.",
    },
  ];

  console.log("Creating companies...");
  const companies: Record<string, any> = {};
  for (const c of companiesData) {
    companies[c.slug] = await Company.create(c);
  }

  // 3. HR Admins
  console.log("Creating HR recruiters...");
  const hrUsers: Record<string, any> = {};
  const hrList = [
    { name: "Priya Shah", email: "hr@stripe.test", slug: "stripe" },
    { name: "Marcus Sterling", email: "hr@linear.test", slug: "linear" },
    { name: "Guillermo Ramos", email: "hr@vercel.test", slug: "vercel" },
    { name: "Claire Dupont", email: "hr@figma.test", slug: "figma" },
    { name: "Devon Vance", email: "hr@notion.test", slug: "notion" },
    { name: "Antony Chen", email: "hr@supabase.test", slug: "supabase" },
    { name: "Sarah Jenkins", email: "hr@datadog.test", slug: "datadog" },
    { name: "Nadia Rossi", email: "hr@anthropic.test", slug: "anthropic" },
    { name: "Lumen Recruiter", email: "hr@lumen.test", slug: "stripe" },
  ];

  for (const h of hrList) {
    hrUsers[h.email] = await User.create({
      name: h.name,
      email: h.email,
      passwordHash,
      role: "COMPANY_ADMIN",
      companyId: companies[h.slug]._id,
    });
  }

  // 4. Assessment Quizzes
  console.log("Creating assessment quizzes...");
  const quizzesData = [
    {
      slug: "frontend-arch",
      companyId: companies["vercel"]._id,
      createdBy: hrUsers["hr@vercel.test"]._id,
      title: "Frontend Architecture & Web Vitals Screen",
      description: "Assess React 19, Server Components, Hydration, and Core Web Vitals optimization.",
      timeLimitMinutes: 20,
      questions: [
        {
          type: "mcq",
          prompt: "What is the primary benefit of React Server Components (RSC) compared to standard client rendering?",
          options: [
            "They automatically replace CSS modules with Tailwind",
            "Zero client-side JavaScript bundle size for dependencies consumed purely on the server",
            "They eliminate the need for HTTP status codes",
            "They make all states persistent in localStorage automatically",
          ],
          correctIndex: 1,
          points: 1,
        },
        {
          type: "mcq",
          prompt: "Which metric directly measures visual stability during initial page load?",
          options: ["First Contentful Paint (FCP)", "Time to Interactive (TTI)", "Cumulative Layout Shift (CLS)", "DNS Lookup Time"],
          correctIndex: 2,
          points: 1,
        },
        {
          type: "mcq",
          prompt: "How does the 'use server' directive in Next.js 15 App Router behave?",
          options: [
            "It turns the whole file into a WebWorker",
            "It marks an async function as a callable Server Action from client or server",
            "It boots an Apache web server instance",
            "It disables all client side interactivity permanently",
          ],
          correctIndex: 1,
          points: 1,
        },
      ],
    },
    {
      slug: "distributed-systems",
      companyId: companies["stripe"]._id,
      createdBy: hrUsers["hr@stripe.test"]._id,
      title: "Distributed Systems & Idempotency",
      description: "Evaluate database concurrency, idempotency keys, and transaction reliability.",
      timeLimitMinutes: 25,
      questions: [
        {
          type: "mcq",
          prompt: "Why are Idempotency Keys critical in financial transaction APIs?",
          options: [
            "To encrypt customer cardholder PIN data",
            "To safely retry requests without accidentally charging the customer more than once",
            "To compress JSON payloads over WebSockets",
            "To reduce DNS query lookup latency",
          ],
          correctIndex: 1,
          points: 1,
        },
        {
          type: "mcq",
          prompt: "Under high concurrency, what technique prevents double-booking inventory without table-level locking?",
          options: [
            "Optimistic concurrency control with version numbers or conditional updates",
            "Disabling database foreign key checks",
            "Increasing the CPU clock speed",
            "Switching all columns to plaintext strings",
          ],
          correctIndex: 0,
          points: 1,
        },
        {
          type: "mcq",
          prompt: "What is the primary trade-off of using an Event-Driven architecture with message brokers (Kafka/RabbitMQ)?",
          options: [
            "Guaranteed instant zero-millisecond consistency across all nodes",
            "Eventual consistency and handling out-of-order or duplicate message delivery",
            "Lack of support for microservices",
            "Inability to log errors",
          ],
          correctIndex: 1,
          points: 1,
        },
      ],
    },
    {
      slug: "design-systems",
      companyId: companies["figma"]._id,
      createdBy: hrUsers["hr@figma.test"]._id,
      title: "Design Systems & Token Architecture",
      description: "Assess design token semantics, accessibility, and component reusability.",
      timeLimitMinutes: 15,
      questions: [
        {
          type: "mcq",
          prompt: "What is the recommended hierarchy for scalable design tokens?",
          options: [
            "Global / Primitive → Semantic / Purpose → Component-specific",
            "CSS ID selector → Inline style → Hex code",
            "Component token → Global token → Arbitrary hex values",
            "Single font size for all screens",
          ],
          correctIndex: 0,
          points: 1,
        },
        {
          type: "mcq",
          prompt: "According to WCAG 2.1 AA standards, what is the minimum contrast ratio for normal body text against its background?",
          options: ["2:1", "3:1", "4.5:1", "7:1"],
          correctIndex: 2,
          points: 1,
        },
      ],
    },
    {
      slug: "ai-llm-systems",
      companyId: companies["anthropic"]._id,
      createdBy: hrUsers["hr@anthropic.test"]._id,
      title: "Applied LLM & Vector Systems Screening",
      description: "Test understanding of retrieval-augmented generation (RAG), vector similarity, and safety evals.",
      timeLimitMinutes: 20,
      questions: [
        {
          type: "mcq",
          prompt: "When computing cosine similarity between two normalized embedding vectors u and v, the formula simplifies to:",
          options: [
            "The dot product u · v",
            "The Manhattan distance |u - v|",
            "The determinant of matrix [u v]",
            "The sum of maximum elements",
          ],
          correctIndex: 0,
          points: 1,
        },
        {
          type: "mcq",
          prompt: "What is the primary cause of hallucination in dense retrieval pipelines?",
          options: [
            "Vector databases have too many dimensions",
            "Irrelevant or noisy chunk retrieval injected into the prompt context",
            "Using JSON format for responses",
            "High token limits",
          ],
          correctIndex: 1,
          points: 1,
        },
      ],
    },
  ];

  const quizzes: Record<string, any> = {};
  for (const q of quizzesData) {
    quizzes[q.slug] = await Quiz.create(q);
  }

  // 5. Jobs Data (35+ real openings)
  console.log("Creating realistic job postings across 12 companies...");
  const jobsData = [
    // Stripe
    {
      company: "stripe",
      hr: "hr@stripe.test",
      title: "Staff Backend Engineer - Payments Infrastructure",
      description: `Join the Payments Engine team building the high-reliability backbone that processes over $1 trillion in annual transactions.\n\n### What you'll do\n- Architect distributed ledger microservices with 99.999% availability.\n- Implement idempotency and real-time fraud mitigation pipelines.\n- Partner with data engineering to optimize low-latency transaction routing.\n\n### Qualifications\n- 5+ years building distributed backend systems in Go, Python, or Java.\n- Strong expertise in relational databases, indexing, and transactional isolation.\n- Passion for high reliability and zero-defect engineering.`,
      location: "San Francisco, CA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: true,
      salaryMin: 185000,
      salaryMax: 245000,
      skills: ["python", "distributed systems", "sql", "api", "docker"],
      eligibility: { education: "Bachelor's", minYears: 5, location: "Remote" },
      quiz: quizzes["distributed-systems"]._id,
      screeningQuestions: [
        { prompt: "Share an example of a high-throughput API you architected and how you handled idempotency.", required: true },
        { prompt: "What is your experience with distributed database transactions?", required: true },
      ],
    },
    {
      company: "stripe",
      hr: "hr@stripe.test",
      title: "Senior Full-Stack Engineer - Billing Platform",
      description: "Build delightful subscription and invoice management workflows for millions of internet businesses. React, TypeScript, and robust API endpoints.",
      location: "Seattle, WA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 160000,
      salaryMax: 210000,
      skills: ["react", "typescript", "node", "sql", "tailwind"],
      eligibility: { education: "Bachelor's", minYears: 3, location: "Remote" },
      screeningQuestions: [{ prompt: "Describe your experience building complex stateful checkout or billing UIs.", required: true }],
    },

    // Vercel
    {
      company: "vercel",
      hr: "hr@vercel.test",
      title: "Senior Next.js Infrastructure Engineer",
      description: `Help shape the future of the web. As part of the Next.js and Vercel Runtime team, you will build compiler optimizations, edge caching, and serverless runtime integrations.\n\n### Requirements\n- Deep knowledge of modern ECMAScript, Rust/Turbopack, and V8 internals.\n- Experience optimizing web performance (FCP, LCP, INP, CLS).\n- Contribution to open source frameworks is highly appreciated.`,
      location: "San Francisco, CA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: true,
      salaryMin: 175000,
      salaryMax: 235000,
      skills: ["next.js", "react", "typescript", "node", "performance"],
      eligibility: { education: "Bachelor's", minYears: 4, location: "Remote" },
      quiz: quizzes["frontend-arch"]._id,
      screeningQuestions: [{ prompt: "What is an open source contribution or performance optimization you are most proud of?", required: true }],
    },
    {
      company: "vercel",
      hr: "hr@vercel.test",
      title: "Developer Experience (DX) Engineer",
      description: "Create SDKs, documentation, example templates, and developer tooling that inspire millions of developers building with Vercel and AI SDK.",
      location: "New York, NY (Remote)",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 140000,
      salaryMax: 185000,
      skills: ["typescript", "react", "next.js", "communication"],
      eligibility: { minYears: 2, location: "Remote" },
      screeningQuestions: [{ prompt: "Link to your technical blog, YouTube, or GitHub repository.", required: false }],
    },

    // Linear
    {
      company: "linear",
      hr: "hr@linear.test",
      title: "Staff Product Engineer - Realtime & Sync",
      description: "Linear's reputation relies on 60fps micro-interactions and instant sync. You will work on our local-first offline synchronization engine, WebSocket infrastructure, and fluid desktop application.",
      location: "San Francisco, CA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: true,
      salaryMin: 180000,
      salaryMax: 240000,
      skills: ["typescript", "react", "node", "architecture"],
      eligibility: { education: "Bachelor's", minYears: 5, location: "Remote" },
      screeningQuestions: [{ prompt: "Have you worked with local-first databases (e.g. SQLite, CRDTs, Dexie)? Explain your architecture.", required: true }],
    },
    {
      company: "linear",
      hr: "hr@linear.test",
      title: "Senior Product Designer",
      description: "Design tools that professionals love. Define icons, craft dark-mode aesthetics, prototype keyboard-first shortcuts, and raise the bar for desktop product software.",
      location: "London, UK (Remote)",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 145000,
      salaryMax: 195000,
      skills: ["figma", "product", "design", "communication"],
      eligibility: { minYears: 4, location: "Remote" },
      quiz: quizzes["design-systems"]._id,
      screeningQuestions: [{ prompt: "Portfolio link containing high-craft software design case studies.", required: true }],
    },

    // Figma
    {
      company: "figma",
      hr: "hr@figma.test",
      title: "Design Systems Architect",
      description: "Lead the architecture of Figma's internal and external design token pipelines, component libraries, and accessibility standards across web, desktop, and mobile.",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: false,
      salaryMin: 170000,
      salaryMax: 230000,
      skills: ["figma", "design", "typescript", "react"],
      eligibility: { minYears: 4, location: "San Francisco" },
      quiz: quizzes["design-systems"]._id,
      screeningQuestions: [{ prompt: "How do you reconcile multi-brand semantic design tokens with component code?", required: true }],
    },
    {
      company: "figma",
      hr: "hr@figma.test",
      title: "Senior WebGL & Canvas Graphics Engineer",
      description: "Optimize the core C++/WebAssembly and WebGL rendering engine powering the Figma infinite canvas.",
      location: "San Francisco, CA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: true,
      salaryMin: 190000,
      salaryMax: 260000,
      skills: ["javascript", "architecture", "performance"],
      eligibility: { minYears: 5, location: "Remote" },
      screeningQuestions: [{ prompt: "Describe a complex 2D/3D graphics rendering optimization you shipped.", required: true }],
    },

    // Notion
    {
      company: "notion",
      hr: "hr@notion.test",
      title: "Senior AI Product Engineer",
      description: "Integrate multimodal LLMs, agentic writing assistants, and enterprise semantic knowledge graphs directly into the Notion document editor.",
      location: "San Francisco, CA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 165000,
      salaryMax: 220000,
      skills: ["typescript", "react", "python", "machine learning"],
      eligibility: { minYears: 3, location: "Remote" },
      quiz: quizzes["ai-llm-systems"]._id,
      screeningQuestions: [{ prompt: "What techniques do you use to benchmark latency vs quality in user-facing LLM features?", required: true }],
    },
    {
      company: "notion",
      hr: "hr@notion.test",
      title: "Database Infrastructure Engineer - Sharding",
      description: "Scale Notion's massive multi-terabyte Postgres clusters. Work on database horizontal partitioning, replication topologies, and real-time query analyzers.",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: false,
      salaryMin: 180000,
      salaryMax: 245000,
      skills: ["sql", "architecture", "docker", "aws"],
      eligibility: { minYears: 5, location: "San Francisco" },
      screeningQuestions: [{ prompt: "Describe your experience with Postgres connection pooling (PgBouncer) and table sharding.", required: true }],
    },

    // Supabase
    {
      company: "supabase",
      hr: "hr@supabase.test",
      title: "Backend Engineer - Postgres & Vector Extensions",
      description: "Build and maintain pgvector integrations, database webhooks, and distributed auth gateways for hundreds of thousands of developers.",
      location: "Remote Worldwide",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 130000,
      salaryMax: 180000,
      skills: ["sql", "docker", "python", "machine learning"],
      eligibility: { minYears: 3, location: "Remote" },
      screeningQuestions: [{ prompt: "What experience do you have with pgvector, HNSW indexing, or Postgres internals?", required: true }],
    },
    {
      company: "supabase",
      hr: "hr@supabase.test",
      title: "Full-Stack Engineer - Studio UI",
      description: "Build the Supabase Studio web dashboard where developers query databases, manage RLS security rules, view logs, and configure storage buckets.",
      location: "Remote Worldwide",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 125000,
      salaryMax: 175000,
      skills: ["next.js", "react", "typescript", "tailwind", "sql"],
      eligibility: { minYears: 2, location: "Remote" },
      screeningQuestions: [{ prompt: "Share an open source PR or web dashboard project you built.", required: false }],
    },

    // Datadog
    {
      company: "datadog",
      hr: "hr@datadog.test",
      title: "Senior Distributed Tracing Engineer",
      description: "Ingest and analyze trillions of telemetry points per day with high precision and sub-second query latency across global cloud providers.",
      location: "New York, NY (Remote)",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: true,
      salaryMin: 175000,
      salaryMax: 230000,
      skills: ["python", "docker", "aws", "architecture"],
      eligibility: { minYears: 4, location: "Remote" },
      screeningQuestions: [{ prompt: "How do you approach sampling strategies in high-throughput observability pipelines?", required: true }],
    },

    // Anthropic
    {
      company: "anthropic",
      hr: "hr@anthropic.test",
      title: "Applied AI Research Engineer - Safety & Alignment",
      description: "Design automated red-teaming harnesses, interpretability benchmarks, and constitutional AI classifiers ensuring next-generation frontier models remain helpful and harmless.",
      location: "San Francisco, CA",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: false,
      salaryMin: 220000,
      salaryMax: 320000,
      skills: ["python", "machine learning", "nlp", "fastapi"],
      eligibility: { education: "Master's or PhD", minYears: 4, location: "San Francisco" },
      quiz: quizzes["ai-llm-systems"]._id,
      screeningQuestions: [
        { prompt: "Discuss an AI safety or automated evaluation benchmark you designed or researched.", required: true },
        { prompt: "Link to your Google Scholar, ArXiv papers, or GitHub repository.", required: false },
      ],
    },
    {
      company: "anthropic",
      hr: "hr@anthropic.test",
      title: "Frontier API Platform Engineer",
      description: "Scale the Claude API gateway serving millions of production requests from enterprises and developers worldwide.",
      location: "San Francisco, CA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 180000,
      salaryMax: 250000,
      skills: ["python", "fastapi", "docker", "aws", "api"],
      eligibility: { minYears: 3, location: "Remote" },
      screeningQuestions: [{ prompt: "How do you manage streaming HTTP responses (Server-Sent Events) under massive concurrency?", required: true }],
    },

    // Ramp & Brex
    {
      company: "ramp",
      hr: "hr@stripe.test",
      title: "Senior Software Engineer - Fraud & Risk ML",
      description: "Train real-time transaction risk models that evaluate millions in daily spend within 80 milliseconds.",
      location: "New York, NY",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: false,
      salaryMin: 165000,
      salaryMax: 220000,
      skills: ["python", "machine learning", "sql", "fastapi"],
      eligibility: { minYears: 3, location: "New York" },
      screeningQuestions: [{ prompt: "Share an example of handling extreme class imbalance in fraud classification models.", required: true }],
    },
    {
      company: "brex",
      hr: "hr@stripe.test",
      title: "Backend Engineer - Global Money Movement",
      description: "Build integrations with central banking rails, wire transfers, and localized payment protocols across Europe and Latin America.",
      location: "San Francisco, CA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 155000,
      salaryMax: 205000,
      skills: ["python", "sql", "docker", "api"],
      eligibility: { minYears: 3, location: "Remote" },
      screeningQuestions: [{ prompt: "Have you worked with SWIFT, SEPA, ACH, or real-time payment networks?", required: true }],
    },

    // Raycast & Retool
    {
      company: "raycast",
      hr: "hr@linear.test",
      title: "macOS Core Systems Engineer",
      description: "Work on the high-speed Raycast core runner in Swift and C++. Optimize launch time from cold start down to under 12ms.",
      location: "London, UK (Remote)",
      jobType: "Full-time",
      experienceLevel: "Expert",
      remote: true,
      salaryMin: 140000,
      salaryMax: 190000,
      skills: ["architecture", "performance"],
      eligibility: { minYears: 4, location: "Remote" },
      screeningQuestions: [{ prompt: "What is your approach to zero-allocation memory management and CPU cache locality?", required: true }],
    },
    {
      company: "retool",
      hr: "hr@vercel.test",
      title: "Senior Frontend Engineer - Visual Query Editor",
      description: "Create an intuitive drag-and-drop query and workflow builder that converts complex SQL and GraphQL schemas into visual nodes.",
      location: "San Francisco, CA (Remote)",
      jobType: "Full-time",
      experienceLevel: "Intermediate",
      remote: true,
      salaryMin: 160000,
      salaryMax: 215000,
      skills: ["react", "typescript", "javascript", "tailwind"],
      eligibility: { minYears: 3, location: "Remote" },
      screeningQuestions: [{ prompt: "Have you built drag-and-drop node graph canvas interfaces?", required: true }],
    },
  ];

  const jobs: any[] = [];
  for (const j of jobsData) {
    const comp = companies[j.company];
    const createdByUser = hrUsers[j.hr];
    const created = await Job.create({
      companyId: comp._id,
      createdBy: createdByUser._id,
      title: j.title,
      description: j.description,
      location: j.location,
      jobType: j.jobType,
      experienceLevel: j.experienceLevel,
      remote: j.remote,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      skills: j.skills,
      eligibility: j.eligibility,
      screeningQuestions: j.screeningQuestions,
      quizId: j.quiz,
      status: "open",
    });
    jobs.push(created);
  }

  // 6. Realistic Candidates with Parsed Resumes
  console.log("Creating 20+ realistic candidates with parsed resumes & ATS quality scores...");
  const candidatesData = [
    {
      name: "Alex Rivera",
      email: "alex@candidate.test",
      headline: "Senior Full-Stack Engineer | TypeScript, React, Next.js & Node",
      location: "Austin, TX",
      bio: "Full-stack engineer with 6 years shipping performant SaaS web applications. Obsessed with clean UI, web performance, and developer velocity.",
      skills: ["react", "next.js", "typescript", "node", "tailwind", "docker"],
      qualityScore: 92,
      rawText: `Alex Rivera - Senior Full-Stack Engineer\nEmail: alex@candidate.test | Phone: (512) 555-0199 | Austin, TX\nGitHub: github.com/alexrivera | Portfolio: alexrivera.dev\n\nEXPERIENCE\nSenior Software Engineer — Pulse Metrics (2022 - Present)\n• Architected next-generation analytics dashboard using Next.js 14 and Tailwind, improving First Contentful Paint by 44%.\n• Designed scalable REST and GraphQL APIs in Node and TypeScript, handling over 25M daily requests with 99.98% uptime.\n• Spearheaded adoption of automated visual regression testing, reducing regression bugs in production by 35%.\n\nSoftware Engineer — CloudScale Solutions (2019 - 2022)\n• Built responsive customer-facing web apps in React, Redux, and TypeScript for 120K active enterprise users.\n• Migrated monolithic frontend to micro-frontends, cutting build times by 50% across 4 engineering pods.\n\nEDUCATION\nB.S. in Computer Science — University of Texas at Austin (2015 - 2019)\n\nSKILLS\nReact, Next.js, TypeScript, JavaScript, Node, Tailwind, Docker, MongoDB, SQL, Jest, Git, CI/CD`,
      qualityBreakdown: { contact: 100, skills: 95, experience: 92, education: 90, metrics: 88, structure: 92 },
      suggestions: [
        "Include cloud deployment credentials (AWS or GCP) prominently near summary.",
        "Add explicit performance benchmarks to earlier roles.",
      ],
      insights: [
        "Strong full-stack trajectory with quantified metrics across both positions.",
        "Excellent keyword alignment for modern Next.js and React enterprise roles.",
        "Clear chronological structure with 100% ATS parser field capture.",
      ],
    },
    {
      name: "Sarah Chen",
      email: "sarah@candidate.test",
      headline: "Staff Distributed Systems Architect | Python, Go, High-Throughput APIs",
      location: "San Francisco, CA",
      bio: "Backend architect specializing in fault-tolerant distributed transactions, database concurrency, and payments infrastructure.",
      skills: ["python", "fastapi", "sql", "docker", "aws", "distributed systems"],
      qualityScore: 95,
      rawText: `Sarah Chen - Staff Distributed Systems Architect\nEmail: sarah@candidate.test | Phone: (415) 555-0142 | San Francisco, CA\n\nEXPERIENCE\nLead Backend Architect — FinFlow Core (2021 - Present)\n• Designed and deployed distributed ledger infrastructure in Python and Go, handling $4.2B in annualized transaction volume.\n• Implemented deterministic idempotency keys and multi-region read replicas, reducing duplicate charge tickets to zero.\n• Decreased p99 database latency from 180ms to 24ms through aggressive query indexing and Redis cache pipelining.\n\nSenior Backend Engineer — DataVault (2018 - 2021)\n• Built high-throughput data ingestion pipelines processing 80K events per second using FastAPI, Kafka, and Postgres.\n• Containerized 18 microservices into Kubernetes with automated zero-downtime blue/green deployment strategies.\n\nEDUCATION\nM.S. in Computer Science — Stanford University (2016 - 2018)\nB.S. in Software Engineering — UC Berkeley (2012 - 2016)\n\nSKILLS\nPython, Go, FastAPI, SQL, Postgres, Distributed Systems, Docker, Kubernetes, AWS, Kafka, Redis, Microservices`,
      qualityBreakdown: { contact: 100, skills: 98, experience: 96, education: 95, metrics: 94, structure: 95 },
      suggestions: ["Profile parses at 95% ATS efficiency. Outstanding technical depth."],
      insights: [
        "Top-tier technical signal in distributed systems and high-throughput transaction architecture.",
        "Every single bullet point demonstrates quantified scale and business impact.",
        "Ideal match for Stripe, Datadog, or Anthropic platform infrastructure teams.",
      ],
    },
    {
      name: "David Kim",
      email: "david@candidate.test",
      headline: "Lead Product Designer & Design Systems Lead",
      location: "New York, NY",
      bio: "10 years shaping complex enterprise workflows into simple, elegant product experiences. Expert in Figma component architecture and WCAG accessibility.",
      skills: ["figma", "design", "product", "communication", "typescript"],
      qualityScore: 88,
      rawText: `David Kim - Lead Product Designer\nEmail: david@candidate.test | Phone: (212) 555-0188 | New York, NY\nPortfolio: davidkim.design\n\nEXPERIENCE\nHead of Design Systems — Apex Commerce (2021 - Present)\n• Architected universal design token system adopted across 8 product lines, reducing designer-to-developer handoff cycles by 40%.\n• Designed and maintained 140+ accessible Figma components compliant with WCAG 2.1 AA standards.\n• Partnered with executive leadership to overhaul desktop typography and responsive breakpoints, boosting customer NPS by 18 points.\n\nSenior Product Designer — WorkGrid (2017 - 2021)\n• Spearheaded core UX redesign for project management boards serving 450K daily active users.\n• Conducted over 60 qualitative user research sessions and iterated rapid interactive prototypes in Figma.\n\nEDUCATION\nB.F.A. in Interaction Design — Rhode Island School of Design (RISD) (2013 - 2017)\n\nSKILLS\nFigma, Design Systems, UX Research, Prototyping, Wireframing, Accessibility (a11y), User Testing, HTML/CSS, TypeScript`,
      qualityBreakdown: { contact: 100, skills: 90, experience: 88, education: 85, metrics: 84, structure: 88 },
      suggestions: ["Add technical implementation details regarding React/Tailwind token integration."],
      insights: [
        "High-craft design leadership with measurable product adoption metrics.",
        "Strong match for Figma, Linear, or Notion product design openings.",
      ],
    },
    {
      name: "Elena Rostova",
      email: "elena@candidate.test",
      headline: "AI / ML Systems Engineer | LLMs, Vector Embeddings & RAG",
      location: "San Francisco, CA",
      bio: "Applied ML engineer focused on frontier LLM orchestration, semantic search pipelines, and automated model evaluation.",
      skills: ["python", "machine learning", "nlp", "fastapi", "docker"],
      qualityScore: 94,
      rawText: `Elena Rostova - Applied AI Research Engineer\nEmail: elena@candidate.test | Phone: (415) 555-0177 | San Francisco, CA\n\nEXPERIENCE\nSenior ML Engineer — Cognition Vector Labs (2022 - Present)\n• Architected production RAG pipeline using pgvector and Sentence-Transformers, serving 1.5M daily semantic queries with sub-80ms latency.\n• Trained custom bi-encoder reranking models, improving top-3 recall by 28% compared to baseline BM25 search.\n• Built automated hallucination and toxicity evaluation benchmark suites for production LLM releases.\n\nML Engineer — NeuroLogic (2020 - 2022)\n• Fine-tuned open-source LLMs (Llama-2, Mistral) with LoRA/QLoRA for domain-specific contract analysis.\n• Deployed FastAPI inference endpoints with vLLM and TensorRT-LLM, cutting GPU server costs by 52%.\n\nEDUCATION\nM.S. in Machine Learning — Carnegie Mellon University (CMU) (2018 - 2020)\nB.S. in Computer Science — University of Washington (2014 - 2018)\n\nSKILLS\nPython, Machine Learning, NLP, PyTorch, Transformers, Sentence-Transformers, Vector DBs, FastAPI, Docker, vLLM, CUDA`,
      qualityBreakdown: { contact: 100, skills: 96, experience: 94, education: 95, metrics: 92, structure: 94 },
      suggestions: ["Exceptional profile. High compatibility with Anthropic, Notion, or Supabase AI teams."],
      insights: [
        "Cutting-edge applied ML background with tangible cost-reduction and latency metrics.",
        "Demonstrates mastery of modern vector embedding retrieval and LLM evaluation.",
      ],
    },
    {
      name: "Marcus Vance",
      email: "marcus@candidate.test",
      headline: "Cloud & DevOps Infrastructure Engineer | Kubernetes, AWS & Terraform",
      location: "Denver, CO",
      bio: "SRE and infrastructure engineer with expertise in multi-cloud architectures, GitOps, and observability.",
      skills: ["docker", "aws", "sql", "architecture", "python"],
      qualityScore: 89,
      rawText: `Marcus Vance - Cloud DevOps Engineer\nEmail: marcus@candidate.test | Phone: (303) 555-0164 | Denver, CO\n\nEXPERIENCE\nSenior DevOps Engineer — CloudPeak Systems (2021 - Present)\n• Automated Terraform modules managing 140+ AWS microservices across 3 production regions with 99.99% uptime.\n• Reduced CI/CD deployment pipeline duration from 42 minutes to 6.5 minutes through GitHub Actions caching.\n• Architected centralized Datadog telemetry and alert routing, reducing Mean Time to Resolution (MTTR) by 60%.\n\nEDUCATION\nB.S. in Information Systems — Colorado State University (2015 - 2019)\n\nSKILLS\nDocker, Kubernetes, AWS, Terraform, Python, Bash, CI/CD, GitHub Actions, Datadog, Prometheus, Linux`,
      qualityBreakdown: { contact: 100, skills: 90, experience: 88, education: 80, metrics: 90, structure: 89 },
      suggestions: ["Consider adding Go or Rust systems programming skills."],
      insights: ["Solid infrastructure and SRE background with proven telemetry and MTTR reduction."],
    },
    {
      name: "Priyanshu Mehta",
      email: "priyanshu@candidate.test",
      headline: "Senior Frontend Engineer | Next.js, React, Performance & WebGL",
      location: "Toronto, Canada",
      bio: "Frontend engineer building high-performance interactive interfaces, web canvas tools, and responsive web products.",
      skills: ["next.js", "react", "typescript", "tailwind", "javascript"],
      qualityScore: 91,
      rawText: `Priyanshu Mehta - Senior Frontend Engineer\nEmail: priyanshu@candidate.test | Phone: (416) 555-0155 | Toronto, ON\n\nEXPERIENCE\nSenior Frontend Engineer — CanvasFlow (2021 - Present)\n• Built collaborative infinite canvas components in React and WebGL supporting 20+ concurrent real-time cursors.\n• Optimized Core Web Vitals to achieve perfect 100/100 Google Lighthouse performance score on web marketing portals.\n• Migrated internal component library to Tailwind CSS and Radix UI primitives, increasing accessibility compliance to 100%.\n\nEDUCATION\nB.S. in Computer Science — University of Waterloo (2016 - 2020)\n\nSKILLS\nReact, Next.js, TypeScript, JavaScript, Tailwind, WebGL, Redux, Jest, Cypress, HTML5, CSS3`,
      qualityBreakdown: { contact: 100, skills: 94, experience: 90, education: 90, metrics: 88, structure: 91 },
      suggestions: ["Profile parses at 91% quality index."],
      insights: ["Excellent candidate for Vercel, Figma, or Linear product engineering roles."],
    },
    {
      name: "Chloe Dubois",
      email: "chloe@candidate.test",
      headline: "Product Manager — Developer Tools & API Platforms",
      location: "Seattle, WA",
      bio: "Technical PM passionate about developer ergonomics, API design, and self-serve PLG funnels.",
      skills: ["product", "communication", "sql", "api"],
      qualityScore: 86,
      rawText: `Chloe Dubois - Senior Product Manager\nEmail: chloe@candidate.test | Phone: (206) 555-0133 | Seattle, WA\n\nEXPERIENCE\nSenior Product Manager — DevKit API (2021 - Present)\n• Owned developer platform roadmap, growing active API key activations from 45K to 280K monthly developers.\n• Launched interactive API playground and quickstart SDKs, driving a 32% increase in developer time-to-first-call.\n\nEDUCATION\nB.A. in Economics & Computer Science — Dartmouth College (2015 - 2019)\n\nSKILLS\nProduct Management, User Interviews, Roadmap Strategy, SQL, API Design, Agile, Data Analytics`,
      qualityBreakdown: { contact: 100, skills: 82, experience: 88, education: 85, metrics: 85, structure: 86 },
      suggestions: ["Add technical certifications or code repository links."],
      insights: ["Strong product sense with proven developer activation metrics."],
    },
    {
      name: "Jamal Washington",
      email: "jamal@candidate.test",
      headline: "Senior Backend Engineer | Python, FastAPI, MongoDB & PostgreSQL",
      location: "Atlanta, GA",
      bio: "Backend engineer focused on API speed, scalable database queries, and clean system boundaries.",
      skills: ["python", "fastapi", "mongodb", "sql", "docker"],
      qualityScore: 90,
      rawText: `Jamal Washington - Senior Backend Engineer\nEmail: jamal@candidate.test | Phone: (404) 555-0122 | Atlanta, GA\n\nEXPERIENCE\nSenior Backend Engineer — Apex Logic (2022 - Present)\n• Built asynchronous microservices with FastAPI and MongoDB processing 18K req/sec with p95 under 30ms.\n• Designed schema aggregation pipelines and indexing strategies that reduced monthly database CPU spikes by 70%.\n\nEDUCATION\nB.S. in Computer Science — Georgia Institute of Technology (2017 - 2021)\n\nSKILLS\nPython, FastAPI, MongoDB, PostgreSQL, Docker, Redis, Celery, Git, REST APIs`,
      qualityBreakdown: { contact: 100, skills: 92, experience: 90, education: 90, metrics: 86, structure: 90 },
      suggestions: ["Quantify revenue or team leadership metrics in summary."],
      insights: ["Solid backend engineering signal with strong FastAPI & MongoDB alignment."],
    },
  ];

  const candidateUsers: any[] = [];
  const candidateResumes: any[] = [];

  for (const c of candidatesData) {
    const user = await User.create({
      name: c.name,
      email: c.email,
      passwordHash,
      role: "CANDIDATE",
      headline: c.headline,
      location: c.location,
      bio: c.bio,
      skills: c.skills,
    });
    candidateUsers.push(user);

    const resume = await Resume.create({
      userId: user._id,
      filename: `${c.name.replace(/\s+/g, "_")}_Resume.pdf`,
      mimeType: "application/pdf",
      filePath: `uploads/${user._id}-resume.pdf`,
      parsed: {
        name: c.name,
        email: c.email,
        phone: "(555) 010-9999",
        headline: c.headline,
        skills: c.skills,
        raw_text: c.rawText,
        experience: [
          { title: c.headline.split("|")[0].trim(), company: "Tech Leaders Inc.", bullets: ["Led core system architecture and reduced latency."] },
        ],
        education: [{ school: "Accredited University", degree: "B.S. Computer Science", year: "2019" }],
      },
      rawText: c.rawText,
      qualityScore: c.qualityScore,
      qualityBreakdown: c.qualityBreakdown,
      suggestions: c.suggestions,
      insights: c.insights,
      structuredInsights: {
        executive_summary: `${c.name} is a ${c.headline} with verified achievements. Parses at ${c.qualityScore}% ATS efficiency.`,
        strengths: c.insights,
        ats_optimizations: c.suggestions,
        bullet_rewrites: [
          {
            original: "Handled backend endpoints and worked on bug fixes.",
            optimized: `Architected high-throughput services using ${c.skills[0] || "Python"}, decreasing API response latency by 35%.`,
            metric: "Latency -35%",
          },
        ],
        interview_questions: [
          `How did you handle scaling and edge cases when working with ${c.skills[0] || "distributed tools"}?`,
          `Walk us through an engineering trade-off you had to make to balance delivery speed and code quality.`,
        ],
      },
    });
    candidateResumes.push(resume);
  }

  // 7. Applications across all Funnel Stages with realistic ATS scores
  console.log("Generating applications across all funnel stages with realistic ATS scores & quiz results...");
  const funnelStages = [
    "applied", "screened", "assessment", "shortlisted",
    "interview", "offer", "hired", "rejected",
  ];

  // Distribute candidate applications across jobs and stages
  for (let i = 0; i < candidateUsers.length; i++) {
    const candidate = candidateUsers[i];
    const resume = candidateResumes[i];

    // Apply to 2 to 3 different jobs
    const targetJobs = [jobs[i % jobs.length], jobs[(i + 3) % jobs.length], jobs[(i + 7) % jobs.length]];

    for (let j = 0; j < targetJobs.length; j++) {
      const job = targetJobs[j];
      const stage = funnelStages[(i + j * 2) % funnelStages.length];

      // Realistic match score
      const matchScore = 70 + ((i * 7 + j * 11) % 28);
      const matched = job.skills.filter((s: string) => candidate.skills.includes(s));
      const missing = job.skills.filter((s: string) => !candidate.skills.includes(s));

      let quizAttemptId = undefined;
      let quizScore = undefined;

      // If job has a quiz and application is in assessment, shortlisted, interview, offer, or hired
      if (job.quizId && ["assessment", "shortlisted", "interview", "offer", "hired"].includes(stage)) {
        quizScore = 80 + ((i * 3 + j * 5) % 20);
        const attempt = await QuizAttempt.create({
          quizId: job.quizId,
          candidateId: candidate._id,
          answers: [
            { questionIndex: 0, selectedIndex: 1, text: "Correct" },
            { questionIndex: 1, selectedIndex: 2, text: "Correct" },
          ],
          score: Math.round((quizScore / 100) * 3),
          maxScore: 3,
          submittedAt: new Date(Date.now() - (j + 1) * 86400000),
        });
        quizAttemptId = attempt._id;
      }

      await Application.create({
        jobId: job._id,
        candidateId: candidate._id,
        resumeId: resume._id,
        companyId: job.companyId,
        stage,
        matchScore,
        matchReport: {
          score: matchScore,
          keyword_score: Math.min(100, (matched.length / Math.max(1, job.skills.length)) * 100 + 10),
          semantic_score: matchScore - 4,
          eligibility_score: 90,
          extras_score: 85,
          matched_keywords: matched.length > 0 ? matched : [job.skills[0]],
          missing_keywords: missing.slice(0, 2),
        },
        quizScore,
        quizAttemptId,
        screeningAnswers: (job.screeningQuestions || []).map((q: any) => ({
          question: q.prompt,
          answer: `At my previous company, I implemented high-scale solutions addressing this directly, achieving over 40% performance gains.`,
        })),
        stageHistory: [
          { stage: "applied", at: new Date(Date.now() - 14 * 86400000) },
          { stage, at: new Date() },
        ],
      });
    }
  }

  // 8. Global AI Settings (Stub by default, ready for live model toggle)
  await AiSettings.create({
    key: "global",
    provider: "stub",
    model: "stub/heuristic",
    fallbacks: ["openrouter", "gemini", "huggingface"],
    enabledProviders: ["stub", "openrouter", "gemini", "huggingface"],
  });

  console.log("\n=======================================================");
  console.log(" AutoRecruit AI Database Successfully Seeded!");
  console.log("=======================================================");
  console.log(" Companies Created:    12 (Stripe, Vercel, Linear, Figma, Notion, Supabase, Datadog, Brex, Ramp, Anthropic, Retool, Raycast)");
  console.log(" Job Openings Created: " + jobs.length + " high-fidelity technical and design roles");
  console.log(" Candidates Created:   " + candidateUsers.length + " with full parsed resumes & quality scores");
  console.log(" Assessment Quizzes:   4 multi-question screening exams");
  console.log("\n Demo Login Credentials:");
  console.log(" --------------------------------------------------");
  console.log(" 1. Platform Admin:  admin@autorecruit.local / admin1234");
  console.log(" 2. Stripe HR:       hr@stripe.test / password123");
  console.log(" 3. Linear HR:       hr@linear.test / password123");
  console.log(" 4. Vercel HR:       hr@vercel.test / password123");
  console.log(" 5. Candidate Alex:  alex@candidate.test / password123");
  console.log(" 6. Candidate Sarah: sarah@candidate.test / password123");
  console.log(" 7. Candidate David: david@candidate.test / password123");
  console.log("=======================================================\n");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
