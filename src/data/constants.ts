export enum SkillNames {
  PYTHON = "js",
  CPP = "ts",
  C = "html",
  JAVA = "css",
  JAVASCRIPT = "react",
  TYPESCRIPT = "vue",

  REACT = "nextjs",
  HTML5 = "tailwind",
  CSS3 = "nodejs",
  FASTAPI = "express",
  HUGGINGFACE = "postgres",
  LANGCHAIN = "mongodb",

  LANGGRAPH = "git",
  OLLAMA = "github",
  OPENROUTER = "prettier",
  SUPABASE = "npm",
  FIREBASE = "firebase",
  ORACLE = "wordpress",

  SQL = "linux",
  GIT = "docker",
  GITHUB = "nginx",
  DOCKER = "aws",
  LINUX = "vim",
  KALILINUX = "vercel",
}

export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};

export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.PYTHON]: {
    id: 1,
    name: "js",
    label: "Python",
    shortDescription: "Core language for AI/ML engineering, async pipelines, and telemetry systems.",
    color: "#3776AB",
    icon: "/assets/skills/python.svg",
  },
  [SkillNames.CPP]: {
    id: 2,
    name: "ts",
    label: "C++",
    shortDescription: "High-performance systems programming, STL algorithms, and competitive problem solving.",
    color: "#00599C",
    icon: "/assets/skills/cpp.svg",
  },
  [SkillNames.C]: {
    id: 3,
    name: "html",
    label: "C",
    shortDescription: "Low-level systems programming, manual memory management, and OS kernel fundamentals.",
    color: "#659AD2",
    icon: "/assets/skills/c.svg",
  },
  [SkillNames.JAVA]: {
    id: 4,
    name: "css",
    label: "Java",
    shortDescription: "Object-oriented software engineering, robust design patterns, and JVM architecture.",
    color: "#EA2D2E",
    icon: "/assets/skills/java.svg",
  },
  [SkillNames.JAVASCRIPT]: {
    id: 5,
    name: "react",
    label: "JavaScript",
    shortDescription: "Modern ES6+ web logic, asynchronous event loops, and interactive client applications.",
    color: "#F7DF1E",
    icon: "/assets/skills/javascript.svg",
  },
  [SkillNames.TYPESCRIPT]: {
    id: 6,
    name: "vue",
    label: "TypeScript",
    shortDescription: "Static type contracts, compile-time safety, and scalable full-stack architectures.",
    color: "#3178C6",
    icon: "/assets/skills/typescript.svg",
  },
  [SkillNames.REACT]: {
    id: 7,
    name: "nextjs",
    label: "React",
    shortDescription: "Component-based UI development, reactive state systems, and modern dashboards.",
    color: "#0098C7",
    icon: "/assets/skills/react.svg",
  },
  [SkillNames.HTML5]: {
    id: 8,
    name: "tailwind",
    label: "HTML5",
    shortDescription: "Semantic document architecture, accessible DOM standards, and SEO-optimized markup.",
    color: "#E34F26",
    icon: "/assets/skills/html5.svg",
  },
  [SkillNames.CSS3]: {
    id: 9,
    name: "nodejs",
    label: "CSS3",
    shortDescription: "Responsive layout architecture, modern CSS Grid, and hardware-accelerated animations.",
    color: "#1572B6",
    icon: "/assets/skills/css3.svg",
  },
  [SkillNames.FASTAPI]: {
    id: 10,
    name: "express",
    label: "FastAPI",
    shortDescription: "High-concurrency asynchronous REST APIs, Pydantic data validation, and worker queues.",
    color: "#009688",
    icon: "/assets/skills/fastapi.svg",
  },
  [SkillNames.HUGGINGFACE]: {
    id: 11,
    name: "postgres",
    label: "Hugging Face",
    shortDescription: "Pretrained transformer architectures, tokenization pipelines, and open model evaluation.",
    color: "#FFD21E",
    icon: "/assets/skills/huggingface.svg",
  },
  [SkillNames.LANGCHAIN]: {
    id: 12,
    name: "mongodb",
    label: "LangChain",
    shortDescription: "LLM prompt chains, document retrieval pipelines, and tool-augmented agent workflows.",
    color: "#00A67E",
    icon: "/assets/skills/langchain.svg",
  },
  [SkillNames.LANGGRAPH]: {
    id: 13,
    name: "git",
    label: "LangGraph",
    shortDescription: "Stateful cyclic graph orchestration for multi-agent loops and checkpoint memory.",
    color: "#15803D",
    icon: "/assets/skills/langgraph.svg",
  },
  [SkillNames.OLLAMA]: {
    id: 14,
    name: "github",
    label: "Ollama",
    shortDescription: "Local LLM execution, quantized model inference, and private AI agent prototyping.",
    color: "#262626",
    icon: "/assets/skills/ollama.svg",
  },
  [SkillNames.OPENROUTER]: {
    id: 15,
    name: "prettier",
    label: "OpenRouter",
    shortDescription: "Unified multi-model API routing, automated provider fallback, and cost optimization.",
    color: "#6366F1",
    icon: "/assets/skills/openrouter.svg",
  },
  [SkillNames.SUPABASE]: {
    id: 16,
    name: "npm",
    label: "Supabase",
    shortDescription: "PostgreSQL serverless backend, Row Level Security policies, and real-time database feeds.",
    color: "#3ECF8E",
    icon: "/assets/skills/supabase.svg",
  },
  [SkillNames.FIREBASE]: {
    id: 17,
    name: "firebase",
    label: "Firebase",
    shortDescription: "Real-time Firestore NoSQL synchronization, cloud functions, and authentication engines.",
    color: "#F57C00",
    icon: "/assets/skills/firebase.svg",
  },
  [SkillNames.ORACLE]: {
    id: 18,
    name: "wordpress",
    label: "Oracle",
    shortDescription: "Enterprise relational database management, ACID transactions, and complex SQL optimization.",
    color: "#F80000",
    icon: "/assets/skills/oracle.svg",
  },
  [SkillNames.SQL]: {
    id: 19,
    name: "linux",
    label: "SQL",
    shortDescription: "Relational database schema modeling, indexing strategies, complex joins, and analytical querying.",
    color: "#336791",
    icon: "/assets/skills/sql.svg",
  },
  [SkillNames.GIT]: {
    id: 20,
    name: "docker",
    label: "Git",
    shortDescription: "Distributed version control, atomic branching strategies, rebase workflows, and repo integrity.",
    color: "#F05032",
    icon: "/assets/skills/git.svg",
  },
  [SkillNames.GITHUB]: {
    id: 21,
    name: "nginx",
    label: "GitHub",
    shortDescription: "Collaborative development, automated CI/CD pipelines, code reviews, and open-source workflows.",
    color: "#181717",
    icon: "/assets/skills/github.svg",
  },
  [SkillNames.DOCKER]: {
    id: 22,
    name: "aws",
    label: "Docker",
    shortDescription: "Containerization, isolated microservice runtimes, and reproducible deployment environments.",
    color: "#2496ED",
    icon: "/assets/skills/docker.svg",
  },
  [SkillNames.LINUX]: {
    id: 23,
    name: "vim",
    label: "Linux",
    shortDescription: "POSIX environment administration, bash shell automation, and cloud server deployment.",
    color: "#24292E",
    icon: "/assets/skills/linux.svg",
  },
  [SkillNames.KALILINUX]: {
    id: 24,
    name: "vercel",
    label: "Kali Linux",
    shortDescription: "Security assessment, penetration testing tools, network reconnaissance, and threat defense.",
    color: "#233547",
    icon: "/assets/skills/kalilinux.svg",
  },
};

export type Experience = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  description: string[];
  skills: SkillNames[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    startDate: "Aug 2026",
    endDate: "Oct 2026",
    title: "AI/ML & Full-Stack Developer Intern",
    company: "10X Technologies",
    description: [
      "Contributed to AI/ML and software engineering initiatives involving production AI models, Large Language Models (LLMs), and Retrieval-Augmented Generation (RAG) systems.",
      "Developed AI-driven application workflows utilizing Hugging Face transformer models and LangChain for structured retrieval and semantic parsing.",
      "Engineered robust REST API microservices, request validation pipelines, and data models to connect client interfaces with inference workloads.",
      "Built responsive user interface components, interactive data visualizations, and telemetry views ensuring low latency and clean state management.",
      "Collaborated on model output evaluation, component regression testing, and code quality reviews to maintain secure data handling across environments.",
    ],
    skills: [
      SkillNames.PYTHON,
      SkillNames.FASTAPI,
      SkillNames.LANGCHAIN,
      SkillNames.HUGGINGFACE,
      SkillNames.REACT,
      SkillNames.GIT,
      SkillNames.GITHUB,
      SkillNames.DOCKER,
    ],
  },
  {
    id: 2,
    startDate: "2024",
    endDate: "2028 (3rd Year)",
    title: "B.Tech in Computer Science & Engineering (Information Security)",
    company: "Vellore Institute of Technology (VIT), Vellore",
    description: [
      "Academic Standing: Current CGPA of 8.27 / 10.0 with specialization in Information Security.",
      "Core Coursework: Data Structures & Algorithms (C++), Object-Oriented Programming (Java), Database Management Systems (DBMS), Operating Systems, Computer Networks, and Information Security.",
      "Constructed algorithmic problem-solving foundations on LeetCode (@Pranayyy_) with systematic C++ implementations.",
      "Earned verified industry credentials from IBM SkillsBuild (Cybersecurity Fundamentals), IBM Career (Building Agents with Agentic AI), Deloitte (Cyber Job Simulation), and IIT Madras (Cyber Ninjas with Ethical Hacking).",
    ],
    skills: [
      SkillNames.CPP,
      SkillNames.JAVA,
      SkillNames.C,
      SkillNames.SQL,
      SkillNames.ORACLE,
      SkillNames.LINUX,
      SkillNames.KALILINUX,
      SkillNames.PYTHON,
    ],
  },
];

export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits maximum photon radiance! Put on your sunglasses.",
    "Caution: Switching to high-visibility light theme. Proceed with care.",
    "Bright mode activated! Engineered for high-illumination environments.",
  ],
  dark: [
    "Dark mode restored: Minimum eye fatigue, maximum focus.",
    "Welcome back to deep space mode. System running optimally.",
    "Dark theme active: Zero distraction, deterministic aesthetics.",
  ],
};
