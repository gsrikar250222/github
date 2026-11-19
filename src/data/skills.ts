/**
 * SKILLS — the full technology ecosystem.
 *
 * ── Classification levels ─────────────────────────────────────────────
 *   'building'  → Actively Building
 *   'working'   → Working Knowledge
 *   'familiar'  → Familiar With
 *   'exploring' → Exploring / Learning
 *
 * No percentages are used anywhere on the site.
 *
 * INITIAL LEVELS ARE PLACEHOLDERS — please review every one.
 * They were seeded with a conservative rule:
 *   • used in a project listed in projects.ts            → 'building'
 *   • core fundamentals (languages, web basics, git, …)  → 'working'
 *   • everything else                                     → 'familiar'
 * Change any level by editing the 3rd argument of s(...).
 *
 * ── Clusters ──────────────────────────────────────────────────────────
 * The 3D constellation groups categories into six clusters around the centre.
 * Move a category to another cluster by changing its `cluster` field.
 */

export type SkillLevel = 'building' | 'working' | 'familiar' | 'exploring'

export const LEVELS: { id: SkillLevel; label: string; hint: string }[] = [
  { id: 'building', label: 'Actively Building', hint: 'Used in current projects' },
  { id: 'working', label: 'Working Knowledge', hint: 'Comfortable using independently' },
  { id: 'familiar', label: 'Familiar With', hint: 'Have used and understand the fundamentals' },
  { id: 'exploring', label: 'Exploring / Learning', hint: 'Currently studying' },
]

/** Set to false to hide classification labels on the public site entirely. */
export const SHOW_SKILL_LEVELS = true

export interface Skill {
  name: string
  description: string
  level: SkillLevel
}

export type ClusterId = 'ai' | 'fullstack' | 'genai' | 'agents' | 'ml' | 'cloud'

export interface SkillCategory {
  id: string
  index: string
  title: string
  summary: string
  cluster: ClusterId
  skills: Skill[]
}

export interface Cluster {
  id: ClusterId
  label: string
  blurb: string
}

export const clusters: Cluster[] = [
  { id: 'genai', label: 'GENERATIVE AI', blurb: 'LLMs, retrieval, embeddings and open-source models.' },
  { id: 'agents', label: 'AGENT SYSTEMS', blurb: 'Autonomous agents, orchestration and voice AI.' },
  { id: 'ml', label: 'MACHINE LEARNING', blurb: 'Models, deep learning, NLP and computer vision.' },
  { id: 'fullstack', label: 'FULL STACK', blurb: 'Frontend, backend and data layers end to end.' },
  { id: 'cloud', label: 'CLOUD & TOOLS', blurb: 'Tooling, integrations and production deployment.' },
  { id: 'ai', label: 'AI ENGINEERING', blurb: 'Languages and the engineering discipline underneath.' },
]

const s = (name: string, description: string, level: SkillLevel): Skill => ({ name, description, level })

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    index: '01',
    title: 'Programming Languages',
    summary: 'The languages everything else is built on.',
    cluster: 'ai',
    skills: [
      s('Python', 'Primary language for AI, ML, automation and backends.', 'building'),
      s('C', 'Systems fundamentals, memory and pointers.', 'working'),
      s('Java', 'Object-oriented programming and DSA practice.', 'working'),
      s('JavaScript', 'The language of the web, front to back.', 'building'),
      s('SQL', 'Querying and modelling relational data.', 'working'),
    ],
  },
  {
    id: 'frontend',
    index: '02',
    title: 'Frontend Engineering',
    summary: 'Interfaces that are fast, responsive and precise.',
    cluster: 'fullstack',
    skills: [
      s('HTML5', 'Semantic, accessible document structure.', 'working'),
      s('CSS3', 'Layout, motion and responsive styling.', 'working'),
      s('JavaScript', 'DOM, async patterns and browser APIs.', 'building'),
      s('React.js', 'Component-driven UIs and state management.', 'building'),
      s('Next.js', 'React framework for routing, SSR and SSG.', 'familiar'),
      s('Responsive Web Design', 'Layouts that adapt from phone to desktop.', 'working'),
      s('Tailwind CSS', 'Utility-first styling and design systems.', 'familiar'),
      s('Modern UI/UX Implementation', 'Turning designs into polished, usable interfaces.', 'working'),
    ],
  },
  {
    id: 'backend',
    index: '03',
    title: 'Backend Engineering',
    summary: 'APIs, services and the logic behind the product.',
    cluster: 'fullstack',
    skills: [
      s('Python Backend Development', 'Services and APIs written in Python.', 'building'),
      s('Flask', 'Lightweight Python web framework.', 'building'),
      s('FastAPI', 'Async, typed Python APIs for AI services.', 'building'),
      s('Node.js', 'JavaScript runtime for servers and tooling.', 'building'),
      s('Express.js', 'Minimal Node.js web framework.', 'building'),
      s('REST API Development', 'Designing resource-oriented HTTP APIs.', 'working'),
      s('API Integration', 'Connecting third-party services and models.', 'working'),
      s('Authentication Systems', 'Sign-in, sessions, tokens and access control.', 'working'),
      s('Backend Architecture', 'Structuring services, layers and data flow.', 'familiar'),
    ],
  },
  {
    id: 'aiml',
    index: '04',
    title: 'Artificial Intelligence & Machine Learning',
    summary: 'Learning from data and putting models to work.',
    cluster: 'ml',
    skills: [
      s('Artificial Intelligence', 'Building systems that perceive, reason and act.', 'building'),
      s('Machine Learning', 'Supervised and unsupervised learning from data.', 'building'),
      s('Deep Learning', 'Neural networks for vision, language and more.', 'building'),
      s('Natural Language Processing (NLP)', 'Understanding and generating human language.', 'building'),
      s('Computer Vision', 'Extracting meaning from images and video.', 'building'),
      s('Model Development', 'Training, evaluating and iterating on models.', 'working'),
      s('Model Integration', 'Embedding trained models inside applications.', 'working'),
      s('AI-powered Applications', 'Products where AI is the core capability.', 'building'),
      s('Predictive Modeling', 'Forecasting outcomes from historical data.', 'familiar'),
      s('Scikit-learn', 'Classical ML algorithms and pipelines in Python.', 'familiar'),
      s('TensorFlow', 'Deep-learning framework by Google.', 'familiar'),
      s('PyTorch', 'Deep-learning framework for research and production.', 'familiar'),
    ],
  },
  {
    id: 'genai',
    index: '05',
    title: 'Generative AI & LLM Engineering',
    summary: 'Large language models, retrieval and open-source AI.',
    cluster: 'genai',
    skills: [
      s('Large Language Models (LLMs)', 'Building applications on top of LLMs.', 'building'),
      s('Generative AI', 'Systems that generate text, speech and content.', 'building'),
      s('Prompt Engineering', 'Designing prompts for reliable model behaviour.', 'working'),
      s('Retrieval-Augmented Generation (RAG)', 'Grounding model answers in retrieved knowledge.', 'familiar'),
      s('AI Chatbots', 'Conversational interfaces powered by LLMs.', 'working'),
      s('Model Integration', 'Wiring hosted and local models into products.', 'working'),
      s('Open-Source AI Models', 'Running and adapting openly licensed models.', 'building'),
      s('Hugging Face Transformers', 'Library for pretrained transformer models.', 'building'),
      s('Ollama', 'Running LLMs locally.', 'building'),
      s('OpenRouter', 'Unified API across many hosted LLMs.', 'building'),
      s('DeepSeek Models', 'Open-weight reasoning and coding models.', 'familiar'),
      s('Qwen Models', 'Open-weight multilingual LLM family.', 'building'),
      s('Llama Models', 'Meta’s open-weight LLM family.', 'building'),
      s('Embedding Models', 'Turning text into vectors for similarity.', 'familiar'),
      s('Vector Search', 'Nearest-neighbour search over embeddings.', 'familiar'),
      s('Semantic Search', 'Finding results by meaning, not keywords.', 'familiar'),
      s('Knowledge Retrieval', 'Pulling the right context for a model.', 'familiar'),
    ],
  },
  {
    id: 'agents',
    index: '06',
    title: 'AI Agents & Multi-Agent Systems',
    summary: 'Models that plan, use tools and work together.',
    cluster: 'agents',
    skills: [
      s('AI Agent Development', 'LLM agents that plan and take actions.', 'building'),
      s('Multi-Agent Systems', 'Specialised agents collaborating on a task.', 'building'),
      s('Agent Orchestration', 'Routing work between agents and steps.', 'building'),
      s('Context Management', 'Deciding what the model sees, and when.', 'working'),
      s('Conversation Memory', 'Short- and long-term memory for agents.', 'working'),
      s('Tool Calling', 'Letting models invoke functions and APIs.', 'working'),
      s('AI Workflow Automation', 'Automating multi-step processes with AI.', 'working'),
    ],
  },
  {
    id: 'voice',
    index: '07',
    title: 'Speech & Voice AI',
    summary: 'Listening, speaking and real-time conversation.',
    cluster: 'agents',
    skills: [
      s('Speech-to-Text (STT)', 'Transcribing spoken audio into text.', 'building'),
      s('Text-to-Speech (TTS)', 'Synthesising natural-sounding speech.', 'building'),
      s('Whisper', 'Open speech-recognition model by OpenAI.', 'building'),
      s('Voice Agent Architecture', 'Pipelines joining STT, LLM and TTS.', 'building'),
      s('Conversational AI', 'Dialogue systems that hold a conversation.', 'working'),
      s('Voice-based Automation', 'Automating tasks through spoken interaction.', 'familiar'),
      s('Speech Processing', 'Handling and transforming audio signals.', 'familiar'),
    ],
  },
  {
    id: 'data',
    index: '08',
    title: 'Databases & Vector Search',
    summary: 'Where application data and embeddings live.',
    cluster: 'fullstack',
    skills: [
      s('MongoDB', 'Document database for flexible schemas.', 'building'),
      s('MongoDB Atlas', 'Managed MongoDB in the cloud.', 'building'),
      s('MySQL', 'Widely used relational database.', 'working'),
      s('SQLite', 'Embedded, file-based SQL database.', 'familiar'),
      s('Firebase', 'Google’s app platform: auth, database, hosting.', 'building'),
      s('Vector Databases', 'Stores built for embedding similarity search.', 'working'),
      s('Qdrant', 'Open-source vector database.', 'building'),
      s('Data Modeling', 'Designing schemas and relationships.', 'working'),
      s('Database Integration', 'Connecting apps and services to data stores.', 'working'),
    ],
  },
  {
    id: 'tools',
    index: '09',
    title: 'Tools & Developer Ecosystem',
    summary: 'The everyday toolkit.',
    cluster: 'cloud',
    skills: [
      s('Git', 'Version control and branching workflows.', 'working'),
      s('GitHub', 'Code hosting, collaboration and reviews.', 'working'),
      s('Docker', 'Containerising apps for consistent environments.', 'familiar'),
      s('Visual Studio Code', 'Primary editor and debugging environment.', 'working'),
      s('Hugging Face', 'Hub for models, datasets and Spaces.', 'building'),
      s('Ollama', 'Local model runtime and model management.', 'building'),
      s('OpenRouter', 'Model gateway for experimentation and routing.', 'building'),
      s('Postman', 'Designing and testing APIs.', 'working'),
      s('AI Development Tools', 'AI-assisted coding and evaluation tooling.', 'working'),
    ],
  },
  {
    id: 'cloud',
    index: '10',
    title: 'Cloud, Deployment & Integrations',
    summary: 'Getting products live and connected.',
    cluster: 'cloud',
    skills: [
      s('Hostinger', 'Web hosting and domain management.', 'familiar'),
      s('Web Application Deployment', 'Shipping apps to production hosts.', 'working'),
      s('API Integration', 'Third-party APIs, SDKs and webhooks.', 'working'),
      s('Firebase Authentication', 'Managed user sign-in and identity.', 'building'),
      s('Google Authentication', 'Sign in with Google via OAuth.', 'working'),
      s('Cloudinary', 'Cloud media storage and transformation.', 'building'),
      s('Razorpay', 'Indian payment gateway integration.', 'building'),
      s('PayU', 'Payment gateway integration.', 'building'),
      s('Webhook Integration', 'Event callbacks between services.', 'working'),
      s('Environment Configuration', 'Secrets, env vars and per-stage config.', 'working'),
      s('Production Deployment', 'Releasing and running apps for real users.', 'familiar'),
    ],
  },
  {
    id: 'engineering',
    index: '11',
    title: 'Software Engineering & Development',
    summary: 'Building complete, maintainable products.',
    cluster: 'ai',
    skills: [
      s('Full Stack Development', 'Owning a product from database to UI.', 'building'),
      s('MERN Stack Development', 'MongoDB, Express, React and Node.js.', 'building'),
      s('E-commerce Development', 'Catalogues, carts, orders and payments.', 'building'),
      s('Admin Dashboard Development', 'Internal tools to manage content and data.', 'building'),
      s('Python Automation', 'Scripts that remove repetitive work.', 'working'),
      s('Software Architecture', 'Structuring systems for change and scale.', 'familiar'),
      s('Modular Development', 'Small, composable, replaceable parts.', 'working'),
      s('Authentication and Authorization', 'Who you are and what you can do.', 'working'),
      s('Payment Gateway Integration', 'Secure checkout and payment flows.', 'building'),
      s('Responsive Web Applications', 'Apps that work on every screen size.', 'working'),
      s('Real-World Product Development', 'Building for actual users and constraints.', 'building'),
      s('Debugging and Testing', 'Finding faults and preventing regressions.', 'working'),
      s('Data Structures and Algorithms', 'Problem-solving fundamentals.', 'working'),
    ],
  },
]

/** Unique skill names across all categories. */
export const uniqueSkillCount = new Set(skillCategories.flatMap((c) => c.skills.map((k) => k.name))).size

export const levelLabel = (l: SkillLevel) => LEVELS.find((x) => x.id === l)?.label ?? l
