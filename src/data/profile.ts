/**
 * PROFILE — single source of truth for personal details.
 *
 * Anything left empty ("" or []) is simply not rendered on the site.
 * Only add information that is true and verifiable.
 */

export interface EducationEntry {
  institution: string
  program: string // e.g. "B.Tech — Artificial Intelligence & Machine Learning"
  period?: string // e.g. "2022 — 2026"
  location?: string
  note?: string
}

export interface JourneyStage {
  label: string
  title: string
  body: string
  /** Optional, only fill in when you know the real dates. */
  period?: string
}

export const profile = {
  brand: 'SRIKAR.',
  tagline: 'Beyond the Interface.',
  name: 'Srikar',
  fullName: 'G Srikarbabu',
  roles: ['AI Engineer', 'Full Stack Developer', 'AI Agent Developer', 'AIML Student'],
  heroRoles: ['AI Engineer.', 'Full Stack Developer.', 'AI Agent Developer.'],
  heroStatement:
    'I engineer intelligent systems and build digital products that connect AI with real-world applications.',
  brandStatement:
    'I build intelligent systems, engineer AI-powered applications, and transform complex ideas into real-world digital products.',

  /** Public site URL — used for canonical / Open Graph / sitemap. Set VITE_SITE_URL at build time instead if you prefer. */
  siteUrl: '',

  /** Portrait shown in the About section (file in /public). Set to '' to hide. */
  photo: { src: 'srikar.jpg', alt: 'Portrait of Srikar', width: 1000, height: 1100 },

  /** Optional location line, e.g. "Hyderabad, India". Leave empty to hide. */
  location: '',

  about: {
    title: 'Driven by curiosity. Built through engineering.',
    intro: [
      'I’m an AIML student and developer who works where artificial intelligence meets product engineering. I’m drawn to the moment an idea stops being a demo and starts behaving like a real system — with data flowing in, models reasoning over it, and an interface people can actually use.',
      'My focus spans machine learning, generative AI and LLM engineering, AI agents and multi-agent orchestration, voice AI, and the full stack needed to ship all of it: frontends, APIs, databases, authentication, payments, and deployment.',
    ],
    interests: [
      'Artificial Intelligence',
      'Machine Learning',
      'Generative AI',
      'LLM Engineering',
      'AI Agents',
      'Full Stack Development',
      'Real-world software products',
    ],
    mindset: [
      {
        title: 'Systems over snippets',
        body: 'I think in pipelines — retrieval, reasoning, tools, memory, interface — and design each layer so it can be swapped, tested, and scaled.',
      },
      {
        title: 'Build to understand',
        body: 'The fastest way to learn a model, framework, or architecture is to put it inside something real and watch where it breaks.',
      },
      {
        title: 'Ship the whole product',
        body: 'An AI feature is only useful when the auth, data, payments, and UI around it work too. I care about the full path to the user.',
      },
      {
        title: 'Honest engineering',
        body: 'Prototypes are labelled as prototypes. I separate what is built, what is in progress, and what is still an idea.',
      },
    ],
  },

  /**
   * Journey — an arc of focus areas, derived from the work in projects.ts.
   * Add real dates via `period` once you want them shown.
   */
  journey: [
    {
      label: '01',
      title: 'Programming foundations',
      body: 'Python, C, Java, JavaScript and SQL — data structures, algorithms, and the habit of reasoning about problems before writing code.',
    },
    {
      label: '02',
      title: 'Full stack products',
      body: 'MERN applications with authentication, admin dashboards, cloud media, and payment gateways — DazzlingLooks, Guruji and Tan Protein Store.',
    },
    {
      label: '03',
      title: 'Machine learning & applied AI',
      body: 'NLP for fake-news analysis (FactLens), deep-learning segmentation for satellite imagery (SatQuery), and multilingual translation (LingoAI).',
    },
    {
      label: '04',
      title: 'Generative AI & LLM systems',
      body: 'LLM-driven review analysis and verification (ReviewAI), retrieval, embeddings, and open-source models through Ollama, OpenRouter and Hugging Face.',
    },
    {
      label: '05',
      title: 'Agents & voice AI',
      body: 'Multi-agent development environments (NEXUS Agent OS) and speech-driven conversational agents (TELLI AI) — orchestration, tools, memory, STT and TTS.',
    },
  ] as JourneyStage[],

  /** Fill in to show the Education block. */
  education: [
    {
      institution: 'PBR Visvodaya Institute of Technology and Science (PBRVITS)',
      program: 'B.Tech — Artificial Intelligence & Machine Learning',
      period: 'Expected 2028',
    },
  ] as EducationEntry[],

  seo: {
    title: 'Srikar | AI Engineer, Full Stack Developer & AI Agent Developer',
    description:
      "Explore Srikar's portfolio featuring Artificial Intelligence, Machine Learning, Generative AI, LLMs, AI Agents, Full Stack Development, and real-world engineering projects.",
  },

  copyrightYear: 2026,
}
