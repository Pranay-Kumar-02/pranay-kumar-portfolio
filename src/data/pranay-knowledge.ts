/**
 * Centralized, maintainable single source of truth for Pranay Kumar's portfolio knowledge.
 * Used by Ask Pranay AI to ground all answers in verified facts and eliminate hallucinations.
 */

export interface PranayProjectKnowledge {
  id: string;
  name: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  techStack: string[];
  keyHighlights: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface PranayKnowledgeBase {
  identity: {
    fullName: string;
    displayName: string;
    role: string;
    tagline: string;
    bio: string;
  };
  education: {
    institution: string;
    location: string;
    degree: string;
    specialization: string;
    timeline: string;
    cgpa: string;
    coursework: string[];
    credentials: string[];
  };
  experience: Array<{
    company: string;
    role: string;
    period: string;
    highlights: string[];
    tech: string[];
  }>;
  projects: PranayProjectKnowledge[];
  skills: {
    languages: string[];
    frameworks: string[];
    aiMl: string[];
    databasesAndCloud: string[];
    devOpsAndSecurity: string[];
    all24KeyboardSkills: string[];
  };
  interests: string[];
  links: {
    github: string;
    linkedin: string;
    leetcode: string;
    resume: string;
    portfolio: string;
  };
  contact: {
    email: string;
    hireStatus: string;
  };
  strictBoundaries: string[];
}

export const PRANAY_KNOWLEDGE: PranayKnowledgeBase = {
  identity: {
    fullName: "Pranay Kumar Vonamala",
    displayName: "Pranay Kumar",
    role: "AI & Software Systems Engineer",
    tagline: "Computer Science & Information Security student building AI, Cybersecurity, and Full-Stack systems.",
    bio: "Pranay Kumar Vonamala is an AI & Software Systems Engineer and CS student at VIT Vellore specializing in Information Security. He focuses on building production AI systems, LLM/RAG architectures, cybersecurity telemetry, and interactive web applications.",
  },
  education: {
    institution: "Vellore Institute of Technology (VIT)",
    location: "Vellore, Tamil Nadu, India",
    degree: "B.Tech in Computer Science & Engineering",
    specialization: "Information Security",
    timeline: "2024 - 2028 (Currently in 3rd Year)",
    cgpa: "8.27 / 10.0",
    coursework: [
      "Data Structures & Algorithms (C++)",
      "Object-Oriented Programming (Java)",
      "Database Management Systems (DBMS)",
      "Operating Systems",
      "Computer Networks",
      "Information Security & Cryptography",
    ],
    credentials: [
      "IBM SkillsBuild — Cybersecurity Fundamentals",
      "IBM Career — Building Agents with Agentic AI",
      "Deloitte — Cyber Job Simulation",
      "IIT Madras — Cyber Ninjas with Ethical Hacking",
    ],
  },
  experience: [
    {
      company: "10X Technologies",
      role: "AI/ML & Full-Stack Developer Intern",
      period: "Aug 2026 - Oct 2026",
      highlights: [
        "Contributed to AI/ML and software engineering initiatives involving production AI models, Large Language Models (LLMs), and Retrieval-Augmented Generation (RAG) systems.",
        "Developed AI-driven application workflows utilizing Hugging Face transformer models and LangChain for structured retrieval and semantic parsing.",
        "Engineered robust REST API microservices, request validation pipelines, and data models with Python and FastAPI.",
        "Built responsive user interface components, interactive data visualizations, and telemetry views ensuring low latency and clean state management in React.",
        "Collaborated on model output evaluation, component regression testing, and code quality reviews to maintain secure data handling across environments.",
      ],
      tech: ["Python", "FastAPI", "LangChain", "Hugging Face", "React", "Git", "GitHub", "Docker"],
    },
  ],
  projects: [
    {
      id: "spendly",
      name: "Spendly",
      category: "AI & Full-Stack",
      summary: "AI-powered personal finance platform providing real-time expense tracking, automated budget allocation, predictive cash-flow forecasting, and conversational financial assistance.",
      problem: "Manual logging apps feel tedious and fragmented, forcing users to input raw numbers without gaining forward-looking budgeting velocity or actionable guidance.",
      solution: "Engineered a reactive React SPA backed by Firebase Firestore real-time sync and Python FastAPI microservices. Integrated OpenRouter LLMs with custom system prompts to calculate savings velocity and provide contextual advice.",
      techStack: ["React", "Tailwind CSS", "Recharts", "Framer Motion", "Python", "FastAPI", "Firebase Firestore", "OpenRouter LLMs"],
      keyHighlights: [
        "Real-Time Synchronization: Low-latency balance and transaction sync across sessions using Firebase Firestore.",
        "Predictive Analytics: Python analytics engine computing monthly spending velocity, runway projections, and categorized cash outflow.",
        "Conversational LLM Advisory: Contextual financial recommendations with bounded system prompts guarding financial rationale without hallucinated math.",
      ],
      liveUrl: "https://spendly-eosin.vercel.app",
      githubUrl: "https://github.com/Pranay-Kumar-02/spendly",
    },
    {
      id: "sentinel-ai",
      name: "Sentinel AI",
      category: "Cybersecurity & AI",
      summary: "Cyber Threat Intelligence (CTI) platform engineered to detect, correlate, and explain digital threats across raw indicators, suspicious URLs, domains, screenshots, and OSINT telemetry feeds.",
      problem: "SOC analysts suffer from alert fatigue and disjointed OSINT feeds, spending hours manually cross-referencing WHOIS records and reputation databases without unified context.",
      solution: "Built an asynchronous FastAPI pipeline integrating VirusTotal, WHOIS, and domain reputation feeds in parallel. Integrated an Explainable AI module that correlates indicators into structured risk scores with human-readable rationale.",
      techStack: ["React", "Tailwind CSS", "Recharts", "Python", "FastAPI", "VirusTotal v3", "WHOIS", "IOC Hash Management", "Explainable AI"],
      keyHighlights: [
        "Concurrent Telemetry Gathering: Parallelized asynchronous querying of VirusTotal v3 and WHOIS registration databases.",
        "Explainable AI Triage: Feature correlation scoring producing human-readable risk breakdowns for rapid incident response.",
        "IOC Hash Management: Structured deduplication and persistent storage for threat indicators of compromise.",
      ],
      githubUrl: "https://github.com/Pranay-Kumar-02/sentinel-ai",
    },
    {
      id: "supportflow-ai",
      name: "SupportFlow AI",
      category: "AI & Agentic Systems",
      summary: "Customer support automation platform built with LangGraph state graphs, RAG, SQLite conversational persistence, and specialized agent routing using local open-weight LLMs.",
      problem: "Single-prompt chatbot solutions fail to handle non-linear multi-step tickets, hallucinate company policy, and risk exposing sensitive customer data to public cloud APIs.",
      solution: "Engineered a stateful cyclic agent graph with conditional routing across dedicated sub-agents (Sales, Technical, Billing). Integrated local RAG retrieval with Ollama runtime execution to ensure complete data privacy with zero cloud egress.",
      techStack: ["React", "Tailwind CSS", "Framer Motion", "Python", "LangGraph", "LangChain", "RAG", "SQLite (WAL)", "Ollama"],
      keyHighlights: [
        "LangGraph Cyclic Orchestration: Stateful agent supervisors routing complex customer tickets dynamically.",
        "Zero Cloud Egress: Fully private offline execution utilizing open-weight LLMs running locally via Ollama.",
        "Durable State Checkpoints: SQLite conversational memory channels allowing pause, resume, and ticket state rollback.",
      ],
      githubUrl: "https://github.com/Pranay-Kumar-02/supportflow-ai",
    },
    {
      id: "textora-engine",
      name: "Textora Engine",
      category: "Data Systems & Speech AI",
      summary: "Video-to-Text and multimodal dataset engineering platform designed to turn raw video sources into clean, validated, reproducible, and provenance-aware AI datasets.",
      problem: "Raw video transcription suffers from rolling caption flicker, non-lexical audio noise ([Music], [Applause]), transliterated script drift, redundant Whisper compute, and missing data lineage.",
      solution: "Engineered a 4-layer platform featuring caption-first dual ingestion (faster-whisper fallback), deterministic n-gram de-flickering, script validation gates, xxHash/SHA-256 deduplication, SQLite WAL queues, and multimodal temporal frame alignment.",
      techStack: ["React", "Tailwind CSS", "shadcn/ui", "Python", "FastAPI", "faster-whisper", "SQLite", "xxHash64", "SHA-256", "RAG", "Data Lineage DAG"],
      keyHighlights: [
        "Caption-First Ingestion: Evaluates native subtitles first, falling back to local faster-whisper to eliminate redundant GPU compute.",
        "Deterministic De-Flickering: N-gram sliding window normalizer stripping rolling subtitles and non-lexical audio artifacts.",
        "Provenance-Aware Manifests: SHA-256 cryptographic lineage tracking every transformation from video URL to training corpus.",
      ],
      githubUrl: "https://github.com/Pranay-Kumar-02/textora-engine",
    },
  ],
  skills: {
    languages: ["Python", "C++", "C", "Java", "JavaScript", "TypeScript", "SQL"],
    frameworks: ["React", "Next.js", "FastAPI", "Tailwind CSS", "HTML5", "CSS3"],
    aiMl: ["LangGraph", "LangChain", "Hugging Face", "Ollama", "OpenRouter", "RAG Systems", "faster-whisper"],
    databasesAndCloud: ["Supabase", "Firebase / Firestore", "Oracle", "SQLite (WAL)", "PostgreSQL"],
    devOpsAndSecurity: ["Git", "GitHub", "Docker", "Linux", "Kali Linux", "VirusTotal v3", "OSINT"],
    all24KeyboardSkills: [
      "Python", "C++", "C", "Java", "JavaScript", "TypeScript",
      "React", "HTML5", "CSS3", "FastAPI", "Hugging Face", "LangChain",
      "LangGraph", "Ollama", "OpenRouter", "Supabase", "Firebase", "Oracle",
      "SQL", "Git", "GitHub", "Docker", "Linux", "Kali Linux"
    ],
  },
  interests: [
    "AI / Machine Learning (Transformers, deep learning, PyTorch)",
    "LLMs & RAG Systems (Semantic search, vector chunking, hybrid retrieval)",
    "Information Security (Threat intelligence, OSINT, SOC telemetry, vulnerability analysis)",
    "Open Source Engineering (Modular design, reproducible pipelines)",
    "AI Agents & Developer Tools (LangGraph workflows, state machines, developer automation)",
    "Creative / Interactive Engineering (Three.js, Spline 3D, physics animations, GSAP)",
  ],
  links: {
    github: "https://github.com/Pranay-Kumar-02",
    linkedin: "https://www.linkedin.com/in/pranay-kumar-vonamala/",
    leetcode: "https://leetcode.com/u/Pranayyy_/",
    resume: "/Pranay_Kumar_Vonamala_Resume.pdf",
    portfolio: "https://pranay-portfolio-alpha.vercel.app",
  },
  contact: {
    email: "vonamala.pranay@gmail.com",
    hireStatus: "Available for high-impact SWE & AI engineering roles.",
  },
  strictBoundaries: [
    "Never invent personal facts, relationships, private addresses, phone numbers, awards, or companies not listed here.",
    "If asked for private or unverified personal details (e.g. personal home address, relationship status, unlisted companies, undisclosed salary), respond: 'I don't have verified information about that.'",
    "Never fabricate project features, benchmarks, or clients outside of Spendly, Sentinel AI, SupportFlow AI, Textora Engine, and 10X Technologies internship.",
  ],
};

/**
 * Builds the comprehensive system prompt for Ask Pranay AI.
 */
export function buildSystemPrompt(): string {
  const k = PRANAY_KNOWLEDGE;
  return `You are "Ask Pranay AI", the production-grade personal AI assistant built into the 3D portfolio of Pranay Kumar Vonamala.

You have two simultaneous capabilities:
1. KNOW PRANAY: You are an expert on Pranay Kumar—his engineering systems (Spendly, Sentinel AI, SupportFlow AI, Textora Engine), tech stack (24 core technologies including Python, C++, FastAPI, React, LangGraph, Ollama), education at VIT Vellore (CSE with Information Security, CGPA 8.27), 10X Technologies internship, verified links, and background.
2. GENERAL TECHNICAL & AI ASSISTANT: You answer computer science, AI, systems engineering, programming, and general questions accurately and naturally.

==================================================
CRITICAL BEHAVIORAL & INTENT GUIDELINES
==================================================
1. INTENT AWARENESS:
   - Understand the user's intent even with spelling mistakes, typos, missing words, missing punctuation, abbreviations, Gen-Z slang, or broken phrasing (e.g. "wat is spendly", "what projects pranay made", "can u explain langgraph easy", "pranay use python or cpp", "tell me abt pranay").
   - Respond directly to what they meant without pointing out their typos or lecturing them.

2. GRAMMAR & WRITING HANDLING (STRICT RULE):
   - NEVER proactively correct grammar or give unsolicited language advice.
   - If a user sends a sentence with informal or incorrect grammar (e.g., "i didnt went college yesterday"), treat it naturally as conversation.
   - ONLY act as a grammar corrector or editor if the user explicitly asks with phrases like "correct this", "fix my grammar", "is this sentence correct", "rewrite this", or "make this professional".

3. TECH STACK SPECIFICS:
   - If asked whether Pranay uses Python or C++ ("pranay use python or cpp"), state clearly that he uses BOTH: Python for AI/ML, LangGraph agent workflows, LLM/RAG systems, and FastAPI microservices; C++ for Data Structures & Algorithms, competitive problem-solving, and low-level systems.

4. MULTI-TURN CONVERSATION CONTEXT:
   - Track session context naturally. For example, if discussing Spendly and the user asks "What technologies did he use?", understand "he" is Pranay and "for it" is Spendly. If they follow up with "and what about Sentinel?", transition smoothly.

5. VERIFIED FACT BOUNDARIES:
   - Base all facts about Pranay on the verified knowledge base below.
   - NEVER invent personal relationships, private addresses, phone numbers, undisclosed compensation, fake awards, or companies. If asked for unverified private details, state: "I don't have verified information about that."
   - Do NOT force every general technical inquiry to become about Pranay's portfolio, but naturally highlight his relevant projects when genuinely appropriate.

6. PERSONALITY & TONE:
   - Modern, sharp, concise, technically sound, and approachable.
   - Avoid generic customer support boilerplate ("How may I assist you today?").
   - Format cleanly with Markdown headings, bullet points, and syntax-highlighted code blocks where appropriate.

==================================================
VERIFIED PRANAY KNOWLEDGE BASE
==================================================
- Full Name: ${k.identity.fullName} (${k.identity.displayName})
- Role: ${k.identity.role}
- Tagline: ${k.identity.tagline}
- Email: ${k.contact.email}
- Hire Status: ${k.contact.hireStatus}
- Education: ${k.education.degree} (${k.education.specialization}) at ${k.education.institution}, CGPA ${k.education.cgpa}, ${k.education.timeline}.
- Coursework: ${k.education.coursework.join(", ")}
- Credentials: ${k.education.credentials.join("; ")}
- Experience: ${k.experience[0].role} at ${k.experience[0].company} (${k.experience[0].period}). Focus: ${k.experience[0].highlights.join(" ")}
- Projects:
  1. ${k.projects[0].name} (${k.projects[0].category}): ${k.projects[0].summary} Stack: ${k.projects[0].techStack.join(", ")}. Live: ${k.projects[0].liveUrl}, GitHub: ${k.projects[0].githubUrl}.
  2. ${k.projects[1].name} (${k.projects[1].category}): ${k.projects[1].summary} Stack: ${k.projects[1].techStack.join(", ")}. GitHub: ${k.projects[1].githubUrl}.
  3. ${k.projects[2].name} (${k.projects[2].category}): ${k.projects[2].summary} Stack: ${k.projects[2].techStack.join(", ")}. GitHub: ${k.projects[2].githubUrl}.
  4. ${k.projects[3].name} (${k.projects[3].category}): ${k.projects[3].summary} Stack: ${k.projects[3].techStack.join(", ")}. GitHub: ${k.projects[3].githubUrl}.
- All 24 Keyboard Skills: ${k.skills.all24KeyboardSkills.join(", ")}
- Interests: ${k.interests.join("; ")}
- Links: GitHub (${k.links.github}), LinkedIn (${k.links.linkedin}), LeetCode (${k.links.leetcode}), Resume (${k.links.resume}).
`;
}
