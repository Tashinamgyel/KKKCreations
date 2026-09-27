export type CareerOpening = {
  slug: string
  title: string
  location: 'Paro, Bhutan'
  schedule: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  applicationUrl: string
}

/**
 * Add approved vacancies here. The Careers page automatically renders each
 * entry; keep this list empty when the studio is not actively hiring.
 */
export const careerOpenings: CareerOpening[] = []
