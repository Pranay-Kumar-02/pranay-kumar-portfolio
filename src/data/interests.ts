import { SkillNames } from "./constants";

export interface Interest {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  primaryKeys: SkillNames[];
  secondaryKeys: SkillNames[];
}

export const INTERESTS: Interest[] = [
  {
    id: "ai-ml",
    title: "AI / Machine Learning",
    subtitle: "Intelligent Systems",
    description: "Building intelligent systems with modern machine learning workflows.",
    color: "#38bdf8",
    primaryKeys: [
      SkillNames.PYTHON,
      SkillNames.HUGGINGFACE,
      SkillNames.LANGCHAIN,
      SkillNames.LANGGRAPH,
      SkillNames.OLLAMA,
      SkillNames.OPENROUTER,
    ],
    secondaryKeys: [],
  },
  {
    id: "llms-rag",
    title: "LLMs & RAG",
    subtitle: "Language & Retrieval",
    description: "Exploring grounded language systems, retrieval, agents, and model orchestration.",
    color: "#a855f7",
    primaryKeys: [
      SkillNames.PYTHON,
      SkillNames.HUGGINGFACE,
      SkillNames.LANGCHAIN,
      SkillNames.LANGGRAPH,
      SkillNames.OLLAMA,
      SkillNames.OPENROUTER,
      SkillNames.FASTAPI,
    ],
    secondaryKeys: [],
  },
  {
    id: "infosec",
    title: "Information Security",
    subtitle: "System Defense & Testing",
    description: "Learning and building around secure systems, testing, and practical security engineering.",
    color: "#22c55e",
    primaryKeys: [
      SkillNames.C,
      SkillNames.PYTHON,
      SkillNames.LINUX,
      SkillNames.KALILINUX,
      SkillNames.GIT,
      SkillNames.GITHUB,
      SkillNames.DOCKER,
    ],
    secondaryKeys: [],
  },
  {
    id: "open-source",
    title: "Open Source Engineering",
    subtitle: "Collaborative Software",
    description: "Contributing to real projects, improving codebases, and learning through collaborative engineering.",
    color: "#f97316",
    primaryKeys: [
      SkillNames.GIT,
      SkillNames.GITHUB,
      SkillNames.DOCKER,
      SkillNames.LINUX,
      SkillNames.PYTHON,
      SkillNames.CPP,
      SkillNames.JAVASCRIPT,
      SkillNames.TYPESCRIPT,
      SkillNames.REACT,
    ],
    secondaryKeys: [],
  },
  {
    id: "ai-agents",
    title: "AI Agents / Developer Tools",
    subtitle: "Autonomous Workflows",
    description: "Exploring tool-calling agents, local models, automation, and developer workflows.",
    color: "#eab308",
    primaryKeys: [
      SkillNames.PYTHON,
      SkillNames.FASTAPI,
      SkillNames.LANGCHAIN,
      SkillNames.LANGGRAPH,
      SkillNames.OLLAMA,
      SkillNames.OPENROUTER,
      SkillNames.GIT,
      SkillNames.GITHUB,
      SkillNames.DOCKER,
    ],
    secondaryKeys: [],
  },
  {
    id: "creative-engineering",
    title: "Creative / Interactive Engineering",
    subtitle: "Expressive Interfaces",
    description: "Building expressive interfaces and interactive technical experiences.",
    color: "#ec4899",
    primaryKeys: [
      SkillNames.JAVASCRIPT,
      SkillNames.TYPESCRIPT,
      SkillNames.REACT,
      SkillNames.HTML5,
      SkillNames.CSS3,
      SkillNames.GIT,
      SkillNames.GITHUB,
    ],
    secondaryKeys: [],
  },
];
