/**
 * ACHIEVEMENTS — hackathons, expos, awards.
 *
 * Add ONLY verified entries. The achievements block (and its stat counter)
 * is hidden while this list is empty.
 */
export interface Achievement {
  title: string // e.g. "Winner — Smart India Hackathon (Internal round)"
  event: string // e.g. "SIH 2025"
  year?: string
  project?: string // project id from projects.ts
  description?: string
  link?: string // verified URL (certificate, article, post)
}

export const achievements: Achievement[] = []
