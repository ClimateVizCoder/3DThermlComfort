export interface Translation {
  biography: {
    title: string
    content: string
  }
  skills: {
    title: string
    items: Array<{
      name: string
      years: number
    }>
  }
  languages: {
    title: string
    items: Array<{
      name: string
      level: string
      percentage: number
    }>
  }
  experience: {
    title: string
    academic: string
    projects: string
    internships: string
  }
  contact: {
    title: string
    name: string
    email: string
    subject: string
    message: string
    send: string
    sending: string
    success: string
    error: string
  }
  nav: {
    learnMore: string
    downloadCV: string
  }
}
