/**
 * PROJECTS — configurable project database.
 *
 * status:   'Completed' | 'In Progress' | 'Prototype' | 'Concept'
 *           Leave undefined until you confirm it — no badge is shown then.
 * links:    only real URLs. Buttons appear only for links that are filled in.
 * media:    image / video paths (put files in /public/projects/...) — shown when set.
 */

export type ProjectStatus = 'Completed' | 'In Progress' | 'Prototype' | 'Concept'
export type ProjectDomain = 'ai' | 'fullstack'

export interface Project {
  id: string
  name: string
  category: string
  domain: ProjectDomain
  description: string
  tech: string[]
  status?: ProjectStatus
  featured?: boolean
  links?: {
    live?: string
    github?: string
    caseStudy?: string
  }
  media?: {
    image?: string // e.g. '/projects/nexus.webp'
    video?: string // e.g. '/projects/nexus.mp4'
    alt?: string
  }
  /** Visual motif for the generated cover when no image is configured. */
  motif: 'orbit' | 'wave' | 'glyph' | 'grid' | 'lens' | 'terrain' | 'stack' | 'leaf' | 'bars'
}

export const projects: Project[] = [
  {
    id: 'nexus-agent-os',
    name: 'NEXUS Agent OS',
    category: 'AI Agent Engineering / Multi-Agent Systems',
    domain: 'ai',
    description:
      'A self-hostable AI development environment designed around specialized agents, planning, coding, reviewing, testing, and security workflows.',
    tech: ['Python', 'FastAPI', 'LLMs', 'Qdrant', 'OpenRouter', 'Ollama', 'Multi-Agent Architecture'],
    status: undefined, // TODO: confirm — 'Completed' | 'In Progress' | 'Prototype' | 'Concept'
    featured: true,
    motif: 'orbit',
  },
  {
    id: 'telli-ai',
    name: 'TELLI AI',
    category: 'Voice AI / Conversational Agents',
    domain: 'ai',
    description:
      'An AI-powered voice calling and lead-generation assistant concept designed to automate business conversations using speech recognition, language models, and speech synthesis.',
    tech: ['Whisper', 'Hugging Face Transformers', 'Qwen', 'Llama', 'TTS', 'Python', 'Voice Agent Architecture'],
    status: 'Concept', // described as a concept in the brief
    featured: true,
    motif: 'wave',
  },
  {
    id: 'lingoai',
    name: 'LINGOAI',
    category: 'AI / NLP / Multilingual Applications',
    domain: 'ai',
    description: 'An AI-powered multilingual communication and translation application.',
    tech: ['React', 'Vite', 'Flask', 'IndicTrans2', 'Python', 'NLP', 'Capacitor'],
    status: undefined, // TODO: confirm
    motif: 'glyph',
  },
  {
    id: 'reviewai',
    name: 'REVIEWAI',
    category: 'Generative AI / Content Analysis',
    domain: 'ai',
    description:
      'An AI-based platform exploring review analysis, verification, and intelligent content evaluation.',
    tech: ['LLMs', 'Qwen', 'OpenRouter', 'Search APIs', 'AI Verification'],
    status: undefined, // TODO: confirm
    motif: 'bars',
  },
  {
    id: 'factlens',
    name: 'FACTLENS',
    category: 'Machine Learning / NLP',
    domain: 'ai',
    description: 'An AI-based fake-news detection and information analysis project.',
    tech: ['Python', 'Hugging Face', 'NLP', 'Machine Learning'],
    status: undefined, // TODO: confirm
    motif: 'lens',
  },
  {
    id: 'satquery',
    name: 'SATQUERY',
    category: 'AI / Computer Vision / Remote Sensing',
    domain: 'ai',
    description: 'An AI-powered satellite image analysis and land-classification project.',
    tech: ['Python', 'U-Net', 'Deep Learning', 'Computer Vision'],
    status: undefined, // TODO: confirm
    motif: 'terrain',
  },
  {
    id: 'dazzlinglooks',
    name: 'DAZZLINGLOOKS',
    category: 'Full Stack / E-commerce',
    domain: 'fullstack',
    description:
      'A complete e-commerce application with product management, authentication, payment integration, cloud media management, and administration workflows.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'Firebase', 'Cloudinary', 'Razorpay'],
    status: undefined, // TODO: confirm
    links: { live: 'https://dazzlinglooks.in/', github: 'https://github.com/gsrikar250222/dazzling' },
    motif: 'grid',
  },
  {
    id: 'guruji-adiguru-ayurveda',
    name: 'GURUJI — ADIGURU AYURVEDA',
    category: 'Full Stack / Digital Platform',
    domain: 'fullstack',
    description:
      'A digital platform combining services, donations, course enrolment, payment workflows, and user/admin experiences.',
    tech: ['React', 'Express', 'MongoDB', 'Firebase', 'Cloudinary', 'PayU'],
    status: undefined, // was 'Concept'; the site is now live — set the real status in /admin
    links: { live: 'https://adiguruayurveda.in/' },
    motif: 'leaf',
  },
  {
    id: 'tan-protein-store',
    name: 'TAN PROTEIN STORE',
    category: 'E-commerce / Business Website',
    domain: 'fullstack',
    description:
      'A premium sports nutrition e-commerce enquiry platform designed around product discovery and WhatsApp-based order enquiries.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary'],
    status: undefined, // TODO: confirm
    motif: 'stack',
  },
  {
    id: 'ai-emotion-detection',
    name: 'AI EMOTION DETECTION SYSTEM',
    category: 'Computer Vision / Deep Learning',
    domain: 'ai',
    description:
      'A facial emotion recognition pipeline trained on the RAF-DB dataset, fine-tuning a MobileNet backbone with transfer learning and experimenting with CNN and Vision Transformer architectures.',
    tech: ['Python', 'PyTorch', 'OpenCV', 'MobileNet', 'ViT', 'Transfer Learning'],
    motif: 'lens',
  },
  {
    id: 'ai-camera-attendance',
    name: 'AI CAMERA ATTENDANCE SYSTEM',
    category: 'Computer Vision / Full Stack',
    domain: 'ai',
    description:
      'A prototype that detects and recognizes faces from camera video to mark classroom attendance automatically, with a FastAPI backend, PostgreSQL storage and a React interface.',
    tech: ['Python', 'OpenCV', 'FastAPI', 'React', 'PostgreSQL', 'Face Recognition'],
    status: 'Prototype',
    motif: 'grid',
  },
  {
    id: 'floodvision',
    name: 'FLOODVISION-7.7M',
    category: 'Deep Learning / Satellite Imagery',
    domain: 'ai',
    description:
      'A deep learning model of about 7.77M parameters that analyzes satellite imagery to identify flood-affected areas for disaster monitoring.',
    tech: ['Deep Learning', 'Satellite Imagery', 'Python'],
    links: { github: 'https://github.com/gsrikar250222/FloodVision-7.7M' },
    motif: 'terrain',
  },
]
