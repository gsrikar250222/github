/**
 * SERVICES — what you offer to clients. Edit freely; this is shown in the Services section.
 * `examples` must match project names in projects.ts so claims stay backed by real work.
 */
export interface Service {
  id: string
  title: string
  summary: string
  details: string
  examples: string[]
}

export const services: Service[] = [
  {
    id: 'agents',
    title: 'AI agents and automation',
    summary: 'Workflows that plan, use tools and report back.',
    details:
      'Multi-agent systems and voice assistants that take a task, break it into steps, call the right tools and return a result you can check.',
    examples: ['NEXUS Agent OS', 'TELLI AI'],
  },
  {
    id: 'llm',
    title: 'LLM and search apps',
    summary: 'Answers grounded in your own data.',
    details:
      'Retrieval, embeddings and language models wired into an app: review analysis, fact checking, translation and question answering.',
    examples: ['ReviewAI', 'FactLens', 'LingoAI'],
  },
  {
    id: 'web',
    title: 'Full-stack web apps',
    summary: 'Storefronts, dashboards, sign-in and payments.',
    details:
      'React front ends with Express and MongoDB back ends, admin panels, cloud media and payment gateways, deployed and ready to use.',
    examples: ['DAZZLINGLOOKS', 'GURUJI — Adiguru Ayurveda', 'TAN PROTEIN STORE'],
  },
  {
    id: 'vision',
    title: 'Computer vision prototypes',
    summary: 'Models that read faces, scenes and satellite images.',
    details:
      'Deep-learning prototypes for recognition and analysis, from classroom attendance to flood detection, with a simple interface on top.',
    examples: ['AI CAMERA ATTENDANCE SYSTEM', 'FLOODVISION-7.7M', 'SATQUERY'],
  },
]
