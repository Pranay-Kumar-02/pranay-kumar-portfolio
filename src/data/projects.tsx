import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { SiThreedotjs } from "react-icons/si";

const MaskIcon = ({ src, title }: { src: string; title?: string }) => (
  <span
    role="img"
    aria-label={title}
    className="block bg-current"
    style={{
      width: "1em",
      height: "1em",
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
    }}
  />
);

const ProjectsLinks = ({ live, repo }: { live?: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && live !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_blank"
          href={live}
        >
          <Button variant={"default"} size={"sm"}>
            Live Demo
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      )}
      {repo && repo !== "#" && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_blank"
          href={repo}
        >
          <Button variant={"outline"} size={"sm"}>
            GitHub Repository
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const brand = (title: string, file: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <MaskIcon src={`/assets/logos/${file}`} title={title} />,
});

const textSkill = (title: string, short: string): Skill => ({
  title,
  bg: "black",
  fg: "white",
  icon: <span className="text-xs font-bold font-mono">{short}</span>,
});

const PROJECT_SKILLS = {
  react: brand("React.js", "react-mono.svg"),
  python: brand("Python", "python-mono.svg"),
  fastapi: textSkill("FastAPI", "API"),
  firebase: brand("Firebase", "firebase-mono.svg"),
  firestore: brand("Firestore", "firebase-mono.svg"),
  openrouter: textSkill("OpenRouter LLM", "LLM"),
  recharts: textSkill("Recharts", "📊"),
  tailwind: brand("Tailwind CSS", "tailwind-css-mono.svg"),
  motion: brand("Framer Motion", "motion.svg"),
  typescript: brand("TypeScript", "typescript-mono.svg"),
  docker: brand("Docker", "docker-mono.svg"),
  virustotal: textSkill("VirusTotal API", "VT"),
  whois: textSkill("OSINT WHOIS", "WHO"),
  explainableAI: textSkill("Explainable AI", "XAI"),
  ioc: textSkill("IOC Management", "IOC"),
  langgraph: textSkill("LangGraph", "LG"),
  langchain: textSkill("LangChain", "LC"),
  rag: textSkill("RAG Systems", "RAG"),
  sqlite: textSkill("SQLite (WAL)", "SQL"),
  ollama: textSkill("Ollama / Local LLM", "OLM"),
  whisper: textSkill("faster-whisper", "STT"),
  xxhash: textSkill("xxHash64 & SHA-256", "HASH"),
  lineage: textSkill("Data Lineage DAG", "DAG"),
  shadcn: brand("shadcn/ui", "shadcn-ui-mono.svg"),
  next: brand("Next.js", "nextdotjs-mono.svg"),
  postgres: brand("PostgreSQL", "postgresql-mono.svg"),
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "spendly",
    category: "AI & Full-Stack",
    title: "Spendly — AI Personal Finance & Predictive Budgeting",
    src: "/assets/projects-screenshots/spendly/1.png",
    screenshots: ["/assets/projects-screenshots/spendly/1.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.recharts,
        PROJECT_SKILLS.motion,
      ],
      backend: [
        PROJECT_SKILLS.fastapi,
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.firebase,
        PROJECT_SKILLS.firestore,
        PROJECT_SKILLS.openrouter,
      ],
    },
    live: "https://spendly-eosin.vercel.app",
    github: "https://github.com/Pranay-Kumar-02/spendly",
    content: (
      <div>
        <TypographyP className="font-mono text-xs text-emerald-400 mb-2">
          SYSTEM 01 // AI PERSONAL FINANCE PLATFORM
        </TypographyP>
        <TypographyH3 className="my-3 text-2xl font-bold">Spendly</TypographyH3>
        <TypographyP className="text-muted-foreground leading-relaxed">
          AI-powered personal finance platform providing real-time expense tracking, automated budget allocation, predictive cash-flow forecasting, and conversational financial assistance.
        </TypographyP>

        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/70 bg-card/40">
            <span className="text-xs font-mono font-semibold text-rose-400">THE PROBLEM</span>
            <p className="text-sm text-muted-foreground mt-1">
              Manual logging applications feel tedious and fragmented, forcing users to input raw numbers without gaining forward-looking budgeting velocity or actionable guidance.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/70 bg-card/40">
            <span className="text-xs font-mono font-semibold text-emerald-400">ENGINEERING SOLUTION</span>
            <p className="text-sm text-muted-foreground mt-1">
              Engineered a reactive React SPA backed by Firebase Firestore real-time sync and Python FastAPI microservices. Integrated OpenRouter LLMs with custom system prompts to calculate savings velocity and provide contextual advice.
            </p>
          </div>
        </div>

        <TypographyH3 className="my-3 text-lg font-semibold">Key Technical Highlights</TypographyH3>
        <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Real-Time Synchronization:</strong> Low-latency balance and transaction sync across sessions using Firebase Firestore.</li>
          <li><strong>Predictive Analytics:</strong> Python analytics engine computing monthly spending velocity, runway projections, and categorized cash outflow.</li>
          <li><strong>Conversational LLM Advisory:</strong> Contextual financial recommendations with bounded system prompts guarding financial rationale.</li>
        </ul>

        <ProjectsLinks
          live="https://spendly-eosin.vercel.app"
          repo="https://github.com/Pranay-Kumar-02/spendly"
        />
        <SlideShow images={["/assets/projects-screenshots/spendly/1.png"]} />
      </div>
    ),
  },
  {
    id: "sentinel-ai",
    category: "Cybersecurity & AI",
    title: "Sentinel AI — Cyber Threat Intelligence & SOC Telemetry",
    src: "/assets/projects-screenshots/sentinel/1.png",
    screenshots: ["/assets/projects-screenshots/sentinel/1.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.recharts,
      ],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.fastapi,
        PROJECT_SKILLS.virustotal,
        PROJECT_SKILLS.whois,
        PROJECT_SKILLS.ioc,
        PROJECT_SKILLS.explainableAI,
      ],
    },
    live: "#",
    github: "https://github.com/Pranay-Kumar-02/sentinel-ai",
    content: (
      <div>
        <TypographyP className="font-mono text-xs text-sky-400 mb-2">
          SYSTEM 02 // CYBER THREAT INTELLIGENCE (CTI) PLATFORM
        </TypographyP>
        <TypographyH3 className="my-3 text-2xl font-bold">Sentinel AI</TypographyH3>
        <TypographyP className="text-muted-foreground leading-relaxed">
          Cyber Threat Intelligence platform engineered to detect, correlate, and explain digital threats across raw indicators, suspicious URLs, domains, screenshots, and OSINT telemetry feeds.
        </TypographyP>

        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/70 bg-card/40">
            <span className="text-xs font-mono font-semibold text-rose-400">THE PROBLEM</span>
            <p className="text-sm text-muted-foreground mt-1">
              Security operations center (SOC) analysts suffer from alert fatigue and disjointed OSINT feeds, spending hours manually cross-referencing WHOIS records and reputation databases without unified context.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/70 bg-card/40">
            <span className="text-xs font-mono font-semibold text-sky-400">ENGINEERING SOLUTION</span>
            <p className="text-sm text-muted-foreground mt-1">
              Built an asynchronous FastAPI pipeline integrating VirusTotal, WHOIS, and domain reputation feeds in parallel. Integrated an Explainable AI module that correlates indicators into structured risk scores with human-readable rationale.
            </p>
          </div>
        </div>

        <TypographyH3 className="my-3 text-lg font-semibold">Key Technical Highlights</TypographyH3>
        <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Concurrent Telemetry Gathering:</strong> Parallelized asynchronous querying of VirusTotal v3 and WHOIS registration databases.</li>
          <li><strong>Explainable AI Triage:</strong> Feature correlation scoring producing human-readable risk breakdowns for rapid incident response.</li>
          <li><strong>IOC Hash Management:</strong> Structured deduplication and persistent storage for threat indicators of compromise.</li>
        </ul>

        <ProjectsLinks repo="https://github.com/Pranay-Kumar-02/sentinel-ai" />
        <SlideShow images={["/assets/projects-screenshots/sentinel/1.png"]} />
      </div>
    ),
  },
  {
    id: "supportflow-ai",
    category: "AI & Agentic Systems",
    title: "SupportFlow AI — Agentic Support Graphs & Local RAG",
    src: "/assets/projects-screenshots/supportflow/1.png",
    screenshots: ["/assets/projects-screenshots/supportflow/1.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.motion,
      ],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.langgraph,
        PROJECT_SKILLS.langchain,
        PROJECT_SKILLS.rag,
        PROJECT_SKILLS.sqlite,
        PROJECT_SKILLS.ollama,
      ],
    },
    live: "#",
    github: "https://github.com/Pranay-Kumar-02/supportflow-ai",
    content: (
      <div>
        <TypographyP className="font-mono text-xs text-purple-400 mb-2">
          SYSTEM 03 // AGENTIC WORKFLOW &amp; RAG SYSTEM
        </TypographyP>
        <TypographyH3 className="my-3 text-2xl font-bold">SupportFlow AI</TypographyH3>
        <TypographyP className="text-muted-foreground leading-relaxed">
          Customer support automation platform built with LangGraph state graphs, RAG, SQLite conversational persistence, and specialized agent routing using local open-weight LLMs.
        </TypographyP>

        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/70 bg-card/40">
            <span className="text-xs font-mono font-semibold text-rose-400">THE PROBLEM</span>
            <p className="text-sm text-muted-foreground mt-1">
              Single-prompt chatbot solutions fail to handle non-linear multi-step tickets, hallucinate company policy, and risk exposing sensitive customer data to public cloud APIs.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/70 bg-card/40">
            <span className="text-xs font-mono font-semibold text-purple-400">ENGINEERING SOLUTION</span>
            <p className="text-sm text-muted-foreground mt-1">
              Engineered a stateful cyclic agent graph with conditional routing across dedicated sub-agents (Sales, Technical, Billing). Integrated local RAG retrieval with Ollama runtime execution to ensure complete data privacy with zero cloud egress.
            </p>
          </div>
        </div>

        <TypographyH3 className="my-3 text-lg font-semibold">Key Technical Highlights</TypographyH3>
        <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>LangGraph Cyclic Orchestration:</strong> Stateful agent supervisors routing complex customer tickets dynamically.</li>
          <li><strong>Zero Cloud Egress:</strong> Fully private offline execution utilizing open-weight LLMs running locally via Ollama.</li>
          <li><strong>Durable State Checkpoints:</strong> SQLite conversational memory channels allowing pause, resume, and ticket state rollback.</li>
        </ul>

        <ProjectsLinks repo="https://github.com/Pranay-Kumar-02/supportflow-ai" />
        <SlideShow images={["/assets/projects-screenshots/supportflow/1.png"]} />
      </div>
    ),
  },
  {
    id: "textora-engine",
    category: "Data Systems & Speech AI",
    title: "Textora Engine — Video-to-Text & Dataset Engineering",
    src: "/assets/projects-screenshots/textora/1.png",
    screenshots: ["/assets/projects-screenshots/textora/1.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.shadcn,
      ],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.fastapi,
        PROJECT_SKILLS.whisper,
        PROJECT_SKILLS.sqlite,
        PROJECT_SKILLS.xxhash,
        PROJECT_SKILLS.rag,
        PROJECT_SKILLS.lineage,
      ],
    },
    live: "#",
    github: "https://github.com/Pranay-Kumar-02/textora-engine",
    content: (
      <div>
        <TypographyP className="font-mono text-xs text-blue-400 mb-2">
          SYSTEM 04 // VIDEO-TO-TEXT &amp; DATASET PLATFORM
        </TypographyP>
        <TypographyH3 className="my-3 text-2xl font-bold">Textora Engine</TypographyH3>
        <TypographyP className="text-muted-foreground leading-relaxed">
          Video-to-Text and multimodal dataset engineering platform designed to turn raw video sources into clean, validated, reproducible, and provenance-aware AI datasets.
        </TypographyP>

        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/70 bg-card/40">
            <span className="text-xs font-mono font-semibold text-rose-400">THE PROBLEM</span>
            <p className="text-sm text-muted-foreground mt-1">
              Raw video transcription suffers from rolling caption flicker, non-lexical audio noise ([Music], [Applause]), transliterated script drift, redundant Whisper compute, and missing data lineage.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/70 bg-card/40">
            <span className="text-xs font-mono font-semibold text-blue-400">ENGINEERING SOLUTION</span>
            <p className="text-sm text-muted-foreground mt-1">
              Engineered a 4-layer platform featuring caption-first dual ingestion (faster-whisper fallback), deterministic n-gram de-flickering, script validation gates, xxHash/SHA-256 deduplication, SQLite WAL queues, and multimodal temporal frame alignment.
            </p>
          </div>
        </div>

        <TypographyH3 className="my-3 text-lg font-semibold">Key Technical Highlights</TypographyH3>
        <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
          <li><strong>Caption-First Ingestion:</strong> Evaluates native subtitles first, falling back to local faster-whisper to eliminate redundant GPU compute.</li>
          <li><strong>Deterministic De-Flickering:</strong> N-gram sliding window normalizer stripping rolling subtitles and non-lexical audio artifacts.</li>
          <li><strong>Provenance-Aware Manifests:</strong> SHA-256 cryptographic lineage tracking every transformation from video URL to training corpus.</li>
        </ul>

        <ProjectsLinks repo="https://github.com/Pranay-Kumar-02/textora-engine" />
        <SlideShow images={["/assets/projects-screenshots/textora/1.png"]} />
      </div>
    ),
  },
];

export default projects;
