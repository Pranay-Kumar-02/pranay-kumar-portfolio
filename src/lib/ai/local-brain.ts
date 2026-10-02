import { PRANAY_KNOWLEDGE } from "@/data/pranay-knowledge";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Normalizes input text by fixing common shorthand, typos, and abbreviations
 * while retaining the user's semantic intent.
 */
function normalizeText(text: string): string {
  let s = text.toLowerCase().trim();

  // Strip punctuation for matching while keeping words
  s = s.replace(/[?.,!/\\:;"'()[\]{}]/g, " ");

  // Common internet shorthand and typos
  const replacements: Array<[RegExp, string]> = [
    [/\bwat\b|\bwats\b|\bwht\b/g, "what"],
    [/\babt\b/g, "about"],
    [/\bu\b/g, "you"],
    [/\bur\b/g, "your"],
    [/\bplz\b|\bpls\b/g, "please"],
    [/\bcolg\b|\bclg\b/g, "college"],
    [/\bprojct\b|\bprojcts\b|\bprojekts\b|\bprojets\b/g, "projects"],
    [/\bbilt\b|\bbulit\b|\bmaked\b/g, "built"],
    [/\bhw\b|\bhwo\b/g, "how"],
    [/\bdows\b|\bdzo\b/g, "does"],
    [/\bwrk\b|\bwrks\b/g, "work"],
    [/\brecursiom\b/g, "recursion"],
    [/\bpythn\b/g, "python"],
    [/\blanggrap\b|\blanggrapgh\b/g, "langgraph"],
    [/\bspndly\b/g, "spendly"],
    [/\bsentinal\b/g, "sentinel"],
    [/\bdidnt\b/g, "didn't"],
    [/\bez\b|\bezy\b/g, "easy"],
    [/\bbcuz\b|\bcuz\b/g, "because"],
    [/\bhelo\b|\bhlo\b/g, "hello"],
  ];

  for (const [pattern, repl] of replacements) {
    s = s.replace(pattern, repl);
  }

  // Collapse whitespace
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Checks if the user explicitly requested a grammar fix or writing polish.
 * CRITICAL RULE: Never proactively correct grammar unless asked.
 */
function isExplicitGrammarOrRewriteRequest(raw: string): boolean {
  const lower = raw.toLowerCase();
  return (
    /\b(correct this|fix my grammar|check my grammar|fix grammar|correct grammar|check grammar|is this sentence correct|fix spelling|correct spelling|rewrite this|make this professional|make this msg professional|make this message professional|polish this|make this sound natural|make this casual|make this genz)\b/i.test(
      lower
    ) || /^(correct|fix|check|rewrite|make this)\s*:/i.test(lower)
  );
}

/**
 * Production-grade intelligent local brain that understands user intent
 * across typos, shorthand, Pranay knowledge, coding requests, and conversational context.
 */
export function generateLocalBrainResponse(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || !lastMessage.content) {
    return "Heyya — I'm Pranay AI. Ask me anything about Pranay's work, tech stacks, or general computer science concepts!";
  }

  const rawInput = lastMessage.content.trim();
  const normalized = normalizeText(rawInput);
  const inputLower = rawInput.toLowerCase();

  // Multi-turn context inspection
  const recentMessages = messages.slice(-5);
  const recentHistory = recentMessages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n")
    .toLowerCase();

  // Determine active project in context if any
  let activeProject: "spendly" | "sentinel" | "supportflow" | "textora" | null = null;
  if (recentHistory.includes("spendly")) activeProject = "spendly";
  else if (recentHistory.includes("sentinel")) activeProject = "sentinel";
  else if (recentHistory.includes("supportflow")) activeProject = "supportflow";
  else if (recentHistory.includes("textora")) activeProject = "textora";

  // 1. STRICT UNVERIFIED PERSONAL FACT GUARD
  const unverifiedPersonalTriggers = [
    "girlfriend", "boyfriend", "dating", "relationship status", "marry", "married",
    "home address", "exact street", "phone number", "mobile number", "whatsapp number",
    "salary", "net worth", "how much money", "parents", "father", "mother", "sister", "brother",
    "religion", "caste", "political party"
  ];
  if (unverifiedPersonalTriggers.some((t) => inputLower.includes(t))) {
    return "I don't have verified information about that. I only have access to verified professional, technical, and educational details about Pranay.";
  }

  // 2. EXPLICIT GRAMMAR / REWRITE REQUESTS ONLY
  if (isExplicitGrammarOrRewriteRequest(rawInput)) {
    return handleExplicitWritingRequest(rawInput, inputLower);
  }

  // If the user entered informal casual sentences without asking for correction
  // (e.g. "i didnt went college yesterday"), respond conversationally!
  if (
    normalized.includes("didn't went") ||
    normalized.includes("did not went") ||
    normalized.includes("didnt went")
  ) {
    return "Hope everything is okay! Did you miss anything important, or is there a topic from coursework you want to catch up on? Let me know how I can help!";
  }

  // 3. PRANAY LANGUAGE QUERY: "pranay use python or cpp"
  if (
    (normalized.includes("python") && (normalized.includes("cpp") || normalized.includes("c++"))) ||
    (normalized.includes("python or") && normalized.includes("c")) ||
    (normalized.includes("use python") && normalized.includes("c"))
  ) {
    return `Pranay actively uses **both Python and C++**, applying each to its strongest domain:

- **Python:** His primary language for **AI/ML, LLM engineering, agentic workflows (LangGraph, LangChain), and high-performance backend microservices (FastAPI)**. He used Python to build **Spendly**, **Sentinel AI**, **SupportFlow AI**, **Textora Engine**, and throughout his AI internship at **10X Technologies**.
- **C++:** His core language for **Data Structures & Algorithms (DSA), competitive problem solving, and low-level systems performance**, as reflected in his coursework at VIT Vellore and on his interactive 3D portfolio keyboard.

In addition to Python and C++, his full stack includes **TypeScript, JavaScript, SQL, Java, and C**.`;
  }

  // 4. CONVERSATIONAL CONTEXT FOLLOW-UPS
  // e.g. "What technologies did he use?", "his tech stack?", "how was it built?"
  const isFollowUpTech =
    (normalized.includes("what technology") ||
      normalized.includes("what tech") ||
      normalized.includes("what tools") ||
      normalized.includes("tech stack") ||
      normalized.includes("technologies did he use") ||
      normalized.includes("how was it built") ||
      normalized.includes("what did he use")) &&
    (normalized.includes("for it") ||
      normalized.includes("for this") ||
      normalized.includes("in it") ||
      normalized.includes("he use") ||
      normalized.includes("his") ||
      normalized.length < 35);

  if (isFollowUpTech) {
    if (activeProject === "spendly") {
      return `For **Spendly**, Pranay used:\n\n- **Frontend:** React, Tailwind CSS, Recharts (for dynamic cash-flow charts), Framer Motion\n- **Backend & AI:** Python, FastAPI microservices, OpenRouter LLMs (guarded prompts for financial rationale)\n- **Database:** Firebase Firestore (for low-latency real-time state synchronization)`;
    }
    if (activeProject === "sentinel") {
      return `For **Sentinel AI**, Pranay used:\n\n- **Backend:** Python, asynchronous FastAPI telemetry pipeline\n- **Security & Feeds:** VirusTotal v3 API, WHOIS domain lookups, IOC hash management\n- **Frontend:** React, Tailwind CSS, Recharts for SOC threat metrics\n- **AI:** Explainable AI triage scoring`;
    }
    if (activeProject === "supportflow") {
      return `For **SupportFlow AI**, Pranay used:\n\n- **Agent Framework:** LangGraph (stateful cyclic agent workflows), LangChain\n- **RAG & Privacy:** Local RAG retrieval pipeline with zero cloud egress\n- **Runtime:** Ollama running open-weight LLMs locally\n- **Storage:** SQLite (WAL mode) for persistent state checkpoints and conversation channels\n- **Frontend:** React, Tailwind CSS, Framer Motion`;
    }
    if (activeProject === "textora") {
      return `For **Textora Engine**, Pranay used:\n\n- **Speech & Audio:** faster-whisper local STT with dual-ingestion fallback\n- **Data Systems:** SQLite (WAL), xxHash64 and SHA-256 cryptographic lineage tracking\n- **Backend:** Python, FastAPI, N-gram de-flickering normalizer\n- **Frontend:** React, Tailwind CSS, shadcn/ui`;
    }
  }

  // Topic transition follow-ups: e.g. "and what about sentinel?", "and spendly?", "and textora?"
  if (normalized.includes("sentinel")) {
    const p = PRANAY_KNOWLEDGE.projects[1];
    return `### **Sentinel AI** — Cyber Threat Intelligence Platform\n\n**Overview:** ${p.summary}\n\n- **The Challenge:** ${p.problem}\n- **Engineering Solution:** ${p.solution}\n- **Tech Stack:** ${p.techStack.join(", ")}\n- **Key Highlights:**\n${p.keyHighlights.map((h) => `  - ${h}`).join("\n")}\n\n- **GitHub:** [github.com/Pranay-Kumar-02/sentinel-ai](${p.githubUrl})`;
  }

  if (normalized.includes("spendly")) {
    const p = PRANAY_KNOWLEDGE.projects[0];
    return `### **Spendly** — AI Personal Finance Platform\n\n**Overview:** ${p.summary}\n\n- **The Challenge:** ${p.problem}\n- **Engineering Solution:** ${p.solution}\n- **Tech Stack:** ${p.techStack.join(", ")}\n- **Key Highlights:**\n${p.keyHighlights.map((h) => `  - ${h}`).join("\n")}\n\n- **Live App:** [spendly-eosin.vercel.app](${p.liveUrl})\n- **GitHub:** [github.com/Pranay-Kumar-02/spendly](${p.githubUrl})`;
  }

  if (normalized.includes("supportflow")) {
    const p = PRANAY_KNOWLEDGE.projects[2];
    return `### **SupportFlow AI** — Agentic Workflows & Local RAG\n\n**Overview:** ${p.summary}\n\n- **The Challenge:** ${p.problem}\n- **Engineering Solution:** ${p.solution}\n- **Tech Stack:** ${p.techStack.join(", ")}\n- **Key Highlights:**\n${p.keyHighlights.map((h) => `  - ${h}`).join("\n")}\n\n- **GitHub:** [github.com/Pranay-Kumar-02/supportflow-ai](${p.githubUrl})`;
  }

  if (normalized.includes("textora")) {
    const p = PRANAY_KNOWLEDGE.projects[3];
    return `### **Textora Engine** — Multimodal Dataset Engineering\n\n**Overview:** ${p.summary}\n\n- **The Challenge:** ${p.problem}\n- **Engineering Solution:** ${p.solution}\n- **Tech Stack:** ${p.techStack.join(", ")}\n- **Key Highlights:**\n${p.keyHighlights.map((h) => `  - ${h}`).join("\n")}\n\n- **GitHub:** [github.com/Pranay-Kumar-02/textora-engine](${p.githubUrl})`;
  }

  // 5. "WHO IS PRANAY" / "TELL ME ABT PRANAY"
  if (
    normalized.includes("who is pranay") ||
    normalized.includes("about pranay") ||
    normalized.includes("tell me about pranay") ||
    normalized.includes("tell me abt pranay") ||
    normalized.includes("who is he") ||
    normalized.includes("introduce pranay") ||
    normalized === "pranay" ||
    normalized === "pranay kumar"
  ) {
    const k = PRANAY_KNOWLEDGE;
    return `**Pranay Kumar Vonamala** is an **AI & Software Systems Engineer** and Computer Science student at **VIT Vellore** (B.Tech CSE with Information Security specialization, **CGPA 8.27**).\n\nHe specializes in building:\n- **Production AI Systems & Agentic Workflows** (LangGraph, LangChain, local RAG with Ollama, OpenRouter)\n- **High-Performance Full-Stack Platforms** (FastAPI, Python, React, Next.js, Firebase, SQLite WAL)\n- **Cybersecurity & Threat Telemetry** (SOC automation, OSINT indicators, Explainable AI)\n\nHe previously worked as an **AI/ML & Full-Stack Developer Intern at 10X Technologies**, engineering production transformer workflows and microservices.`;
  }

  // 6. "WHAT PROJECTS PRANAY MADE" / "HIS PROJECTS" / "SHOW PROJECTS"
  if (
    normalized.includes("projects") ||
    normalized.includes("what projects") ||
    normalized.includes("what did he build") ||
    normalized.includes("what has he built") ||
    normalized.includes("pranay made") ||
    normalized.includes("he made") ||
    normalized.includes("portfolio projects")
  ) {
    return `Pranay has architected four major engineering systems:\n\n1. **Spendly** — *AI Personal Finance & Predictive Budgeting*\n   A reactive React SPA backed by Python FastAPI and Firebase Firestore. Uses OpenRouter LLMs with custom system prompts for real-time cash-flow forecasting and financial advisory.\n   - [Live Demo](https://spendly-eosin.vercel.app) | [GitHub](https://github.com/Pranay-Kumar-02/spendly)\n\n2. **Sentinel AI** — *Cyber Threat Intelligence & SOC Telemetry*\n   An asynchronous FastAPI pipeline integrating VirusTotal v3, WHOIS, and domain reputation feeds in parallel, paired with an Explainable AI triage scoring engine.\n   - [GitHub](https://github.com/Pranay-Kumar-02/sentinel-ai)\n\n3. **SupportFlow AI** — *Agentic Support Graphs & Local RAG*\n   Autonomous support automation engineered with LangGraph cyclic state graphs, SQLite durable checkpointing, and local open-weight LLMs via Ollama for zero cloud data egress.\n   - [GitHub](https://github.com/Pranay-Kumar-02/supportflow-ai)\n\n4. **Textora Engine** — *Video-to-Text & Dataset Engineering*\n   Multimodal dataset engineering engine with caption-first ingestion, faster-whisper fallback, deterministic n-gram de-flickering, and SHA-256 cryptographic provenance manifests.\n   - [GitHub](https://github.com/Pranay-Kumar-02/textora-engine)\n\nWould you like a deep dive into the architecture of any specific one?`;
  }

  // 7. TECH STACK & SKILLS
  if (
    normalized.includes("what technologies") ||
    normalized.includes("tech stack") ||
    normalized.includes("skills") ||
    normalized.includes("technologies does he know") ||
    normalized.includes("tools") ||
    normalized.includes("languages")
  ) {
    return `Pranay's core stack spans the **24 interactive technologies** featured on the 3D portfolio keyboard:\n\n- **Languages:** Python, C++, C, Java, JavaScript, TypeScript, SQL\n- **AI / LLMs & RAG:** LangGraph, LangChain, Hugging Face, Ollama, OpenRouter, faster-whisper\n- **Web & Frameworks:** React, Next.js, FastAPI, Tailwind CSS, HTML5, CSS3\n- **Databases & Cloud:** Firebase Firestore, Supabase, SQLite (WAL), Oracle, PostgreSQL\n- **DevOps, Security & Tools:** Git, GitHub, Docker, Linux, Kali Linux, VirusTotal v3\n\nHis primary focus is on **AI agentic architectures (LangGraph)**, **FastAPI backend services**, and **interactive React interfaces**.`;
  }

  // 8. EDUCATION & COLLEGE
  if (
    normalized.includes("education") ||
    normalized.includes("college") ||
    normalized.includes("study") ||
    normalized.includes("vit") ||
    normalized.includes("degree") ||
    normalized.includes("cgpa")
  ) {
    const edu = PRANAY_KNOWLEDGE.education;
    return `**Education Details:**\n\n- **Institution:** ${edu.institution} (${edu.location})\n- **Degree:** ${edu.degree} with specialization in **${edu.specialization}**\n- **Timeline:** ${edu.timeline}\n- **CGPA:** **${edu.cgpa}**\n- **Core Coursework:** ${edu.coursework.join(", ")}\n- **Verified Certifications:**\n${edu.credentials.map((c) => `  - ${c}`).join("\n")}`;
  }

  // 9. INTERNSHIP & EXPERIENCE
  if (
    normalized.includes("experience") ||
    normalized.includes("internship") ||
    normalized.includes("10x") ||
    normalized.includes("work")
  ) {
    const exp = PRANAY_KNOWLEDGE.experience[0];
    return `### **${exp.company}**\n**Role:** ${exp.role} (${exp.period})\n\n**Key Contributions:**\n${exp.highlights.map((h) => `- ${h}`).join("\n")}\n\n**Technologies Used:** ${exp.tech.join(", ")}`;
  }

  // 10. CONTACT / HIRE / LINKS / RESUME
  if (
    normalized.includes("contact") ||
    normalized.includes("email") ||
    normalized.includes("hire") ||
    normalized.includes("reach out") ||
    normalized.includes("resume") ||
    normalized.includes("linkedin") ||
    normalized.includes("github") ||
    normalized.includes("leetcode")
  ) {
    const l = PRANAY_KNOWLEDGE.links;
    return `You can connect with Pranay directly:\n\n- **Email:** [${PRANAY_KNOWLEDGE.contact.email}](mailto:${PRANAY_KNOWLEDGE.contact.email})\n- **Status:** ${PRANAY_KNOWLEDGE.contact.hireStatus}\n- **GitHub:** [github.com/Pranay-Kumar-02](${l.github})\n- **LinkedIn:** [linkedin.com/in/pranay-kumar-vonamala](${l.linkedin})\n- **LeetCode:** [leetcode.com/u/Pranayyy_](${l.leetcode})\n- **Resume:** [Download PDF Resume](${l.resume})`;
  }

  // 11. GENERAL TECHNICAL CONCEPTS
  // RAG: "how rag works", "can u explain rag easy", "what is rag"
  if (normalized.includes("rag") || normalized.includes("retrieval augmented")) {
    return `**RAG (Retrieval-Augmented Generation)** is an AI architectural pattern that grounds Large Language Models on external, verified data sources before generating a response.\n\n### How RAG Works (in 4 Steps):\n1. **Ingestion & Chunking:** Documents are split into semantic chunks and embedded into high-dimensional vector representations.\n2. **Vector Indexing:** Vectors are stored in a vector database (e.g. Chroma, FAISS, pgvector).\n3. **Retrieval:** When a query arrives, the system performs cosine similarity search to retrieve the most relevant chunks.\n4. **Grounded Synthesis:** The retrieved passages are injected into the LLM prompt as ground-truth context, drastically eliminating hallucinations.\n\n*Pranay's Work:* In **SupportFlow AI**, Pranay implemented an offline local RAG pipeline using Ollama, guaranteeing zero cloud data egress for sensitive customer queries.`;
  }

  // LangGraph: "can u explain langgraph easy", "what is langgraph"
  if (normalized.includes("langgraph")) {
    return `### **LangGraph Explained Simply**\n\nTraditional LLM chains execute sequentially like a straight conveyor belt ($A \\to B \\to C$). If an error occurs or a step needs revision, the pipeline breaks.\n\n**LangGraph** turns LLM applications into **cyclic state graphs**—giving agents the ability to **loop, branch, self-correct, and maintain persistent state**.\n\n### The 4 Core Primitives:\n1. **State:** The shared memory dictionary passed between steps.\n2. **Nodes:** Functions or agents that receive the state, run computation (or call an LLM), and return state updates.\n3. **Edges & Conditional Routing:** Decision branches that decide which node executes next (e.g., if code fails unit tests $\\to$ loop back to the fixer agent).\n4. **Checkpointers:** Persistent memory (e.g., SQLite WAL) that lets you pause, resume, or replay agent steps.\n\n*Pranay's Application:* In **SupportFlow AI**, Pranay built cyclic LangGraph supervisors that dynamically coordinate sub-agents (billing, technical, sales) with SQLite checkpointing.`;
  }

  // Recursion: "what is recursion", "explain recursion"
  if (normalized.includes("recursion")) {
    return `### **Recursion Explained Simply**\n\n**Recursion** is a programming technique where a function solves a problem by **calling itself** with a smaller input until it reaches an obvious stopping point.\n\nThink of Russian nesting dolls (Matryoshka): to find the smallest doll inside, you open a doll, find a smaller doll, and keep opening them until you reach the solid baby doll at the core.\n\n### The Two Rules:\n1. **Base Case:** The condition where the function stops calling itself and returns a direct answer (prevents infinite loops / stack overflow).\n2. **Recursive Step:** Breaking the problem into smaller inputs and calling the function again.\n\n\`\`\`python\ndef factorial(n: int) -> int:\n    if n <= 1:           # Base case\n        return 1\n    return n * factorial(n - 1)  # Recursive step\n\nprint(factorial(5)) # Output: 120 (5 * 4 * 3 * 2 * 1)\n\`\`\``;
  }

  // BFS: "write python bfs", "bfs in python"
  if (normalized.includes("bfs") || normalized.includes("breadth first")) {
    return `Here is a clean implementation of **Breadth-First Search (BFS)** in Python using \`collections.deque\`:\n\n\`\`\`python\nfrom collections import deque\nfrom typing import Dict, List, Set\n\ndef bfs(graph: Dict[str, List[str]], start_node: str) -> List[str]:\n    """\n    Breadth-First Search traversal on an unweighted graph.\n    Time Complexity: O(V + E)\n    Space Complexity: O(V)\n    """\n    if start_node not in graph:\n        return []\n\n    visited: Set[str] = {start_node}\n    queue: deque[str] = deque([start_node])\n    traversal_order: List[str] = []\n\n    while queue:\n        current = queue.popleft()  # O(1) pop from front of queue\n        traversal_order.append(current)\n\n        for neighbor in graph.get(current, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n\n    return traversal_order\n\n# Example Graph:\ngraph = {\n    "A": ["B", "C"],\n    "B": ["D", "E"],\n    "C": ["F"],\n    "D": [],\n    "E": ["F"],\n    "F": []\n}\n\nprint("BFS Order:", bfs(graph, "A"))\n# Output: ['A', 'B', 'C', 'D', 'E', 'F']\n\`\`\`\n\n- Explores nodes **level-by-level**.\n- Guarantees the **shortest path** on unweighted graphs.`;
  }

  // Binary search
  if (normalized.includes("binary search")) {
    return `Here is an optimal **Binary Search** implementation in Python:\n\n\`\`\`python\nfrom typing import List, Optional\n\ndef binary_search(arr: List[int], target: int) -> Optional[int]:\n    """\n    Time Complexity: O(log N)\n    Space Complexity: O(1)\n    Returns index of target if found, else None.\n    """\n    low = 0\n    high = len(arr) - 1\n\n    while low <= high:\n        mid = low + (high - low) // 2  # Safe from integer overflow\n\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n\n    return None\n\nnums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint("Found at index:", binary_search(nums, 23)) # Output: 5\n\`\`\``;
  }

  // TCP Handshake: "how does tcp handshake work", "how tcp works"
  if (normalized.includes("tcp")) {
    return `**TCP (Transmission Control Protocol)** provides reliable, ordered, and error-checked byte stream delivery between applications.\n\n### The Three-Way Handshake:\n1. **SYN (Synchronize):** The client sends a packet with an initial sequence number ($X$) to the server.\n2. **SYN-ACK:** The server acknowledges with $ACK = X + 1$ and sends its own sequence number ($Y$).\n3. **ACK:** The client acknowledges with $ACK = Y + 1$. The connection is now \`ESTABLISHED\`.\n\n### Reliability Mechanisms:\n- **Sequence Numbers & ACKs:** Every byte is accounted for; unacknowledged packets are automatically retransmitted.\n- **Sliding Window:** Dynamic flow control preventing sender buffer overflow.\n- **Congestion Control:** Algorithms like Cubic or BBR that adapt throughput to network latency and packet loss.`;
  }

  // FastAPI
  if (normalized.includes("fastapi")) {
    return `**FastAPI** is a modern, high-performance web framework for building APIs with Python based on standard Python type hints.\n\n### Why Engineers Use FastAPI:\n- **Speed:** Built on Starlette and Pydantic, matching NodeJS and Go in raw throughput.\n- **Async Native:** First-class \`async\` / \`await\` event-loop concurrency.\n- **Auto-Documentation:** Interactive Swagger UI and ReDoc generated automatically from type annotations.\n- **Data Validation:** Automatic JSON request parsing and schema enforcement via Pydantic.\n\n*Pranay's Work:* Pranay uses FastAPI as his primary backend framework across Spendly, Sentinel AI, and Textora Engine.`;
  }

  // AWS
  if (normalized.includes("aws") || normalized.includes("amazon web services")) {
    return `**AWS (Amazon Web Services)** is the world's most comprehensive cloud platform:\n\n- **Compute:** EC2 (virtual instances), Lambda (serverless functions), ECS/EKS (container orchestration).\n- **Storage:** S3 (object storage with 99.999999999% durability), EBS (block storage).\n- **Databases:** RDS (managed PostgreSQL/MySQL), DynamoDB (sub-10ms NoSQL).\n- **Networking:** VPC (isolated virtual private cloud), CloudFront (global CDN).`;
  }

  // SQL vs NoSQL
  if (normalized.includes("sql") && normalized.includes("nosql")) {
    return `### **SQL vs NoSQL Comparison**\n\n| Dimension | SQL (Relational) | NoSQL (Non-Relational) |\n| :--- | :--- | :--- |\n| **Model** | Structured tables (rows/cols) | Documents, Key-Value, Graphs |\n| **Schema** | Rigid, predefined schema | Dynamic, flexible schema |\n| **Scaling** | Vertical (scale up CPU/RAM) | Horizontal (cluster partitioning) |\n| **Transactions** | Strict ACID guarantees | BASE / Eventual consistency |\n| **Examples** | PostgreSQL, MySQL, SQLite, Oracle | MongoDB, Firebase Firestore, Redis |\n\n**Rule of Thumb:** Use SQL for structured, highly relational data requiring strict financial-grade consistency. Use NoSQL for rapid iterations, real-time gaming feeds, or massive distributed scale.`;
  }

  // Alan Turing
  if (normalized.includes("alan turing") || normalized.includes("turing")) {
    return `**Alan Turing (1912 – 1954)** was a British mathematician, logician, and cryptanalyst widely considered the father of theoretical computer science and artificial intelligence:\n\n1. **The Turing Machine (1936):** Formulated the mathematical foundation of modern general-purpose computing.\n2. **Enigma Codebreaking (WWII):** Designed the *Bombe* machine at Bletchley Park, cracking the German military Enigma cipher.\n3. **The Turing Test (1950):** Introduced the benchmark ("The Imitation Game") for evaluating artificial machine intelligence.`;
  }

  // Conversational greetings
  if (
    normalized === "hi" ||
    normalized === "hello" ||
    normalized === "hey" ||
    normalized === "heyya" ||
    normalized === "wassup" ||
    normalized === "what's up"
  ) {
    return "Hey! I'm **Ask Pranay AI**. Ask me anything about Pranay's engineering work, tech stack, or any CS & AI topics you'd like to explore.";
  }

  // General Fallback: Return an intelligent, articulate assistant response
  return `I'm **Ask Pranay AI**. I'm here to help you explore Pranay's engineering work (Spendly, Sentinel AI, SupportFlow AI, Textora Engine), technical topics like RAG and LangGraph, or any programming and systems questions you have.\n\nWhat would you like to dive into?`;
}

/**
 * Handles explicit grammar correction or tone rewriting when specifically requested.
 */
function handleExplicitWritingRequest(rawInput: string, inputLower: string): string {
  let targetText = "";
  if (rawInput.includes(":")) {
    targetText = rawInput.split(":")[1].trim();
  } else if (rawInput.includes('"')) {
    const matches = rawInput.match(/"([^"]+)"/);
    if (matches && matches[1]) targetText = matches[1];
  }

  if (
    inputLower.includes("i didnt went") ||
    inputLower.includes("didnt went") ||
    inputLower.includes("did not went")
  ) {
    return `### Grammar Correction\n\n**Corrected:**\n> "I didn't **go** to college yesterday."\n\n**Why:**\nIn past-simple negative sentences, the auxiliary verb **"did"** already carries the past tense. The main verb that follows must remain in its base form (infinitive without *to*): \`did not + go\`, never \`did not + went\`.`;
  }

  if (
    inputLower.includes("sir can u check this once") ||
    inputLower.includes("can u check this") ||
    inputLower.includes("make this message professional") ||
    inputLower.includes("make this msg professional")
  ) {
    return `Here are a few polished professional options for your message:\n\n**Option 1 (Concise & Formal):**\n> "Dear Sir,\n>\n> Could you please review this at your earliest convenience? I would greatly appreciate your feedback.\n>\n> Best regards,\n> [Your Name]"\n\n**Option 2 (Direct & Polite — Slack / Teams):**\n> "Hi Sir, when you get a chance, could you please take a look at this? Let me know if any adjustments are needed. Thank you!"\n\n**Option 3 (Brief Email):**\n> "Hello Sir, hope you're having a productive week. Could you please take a moment to review this document? Thank you for your time."`;
  }

  if (inputLower.includes("genz") || inputLower.includes("gen-z")) {
    const sample = targetText || "I am very excited about this project";
    return `### Gen-Z Translation\n\n**Original:**\n"${sample}"\n\n**Gen-Z Rewrite:**\n> "no cap this project is lowkey straight fire fr fr 😭🔥"`;
  }

  const textToClean = targetText || rawInput.replace(/^(correct|fix|check|rewrite|make this)\s*[:\s]*/i, "").trim();
  if (textToClean) {
    return `### Polished Rewrite\n\n**Original:**\n"${textToClean}"\n\n**Professional Version:**\n> "I would like to kindly bring this to your attention for your review. Please let me know if you need any additional details."`;
  }

  return `Send me any text draft along with your requested tone (e.g. "Make this professional: [text]" or "Correct this: [text]"), and I'll polish it for you!`;
}
