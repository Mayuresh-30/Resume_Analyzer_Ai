export type Suggestion = {
  category: string
  issue: string
  fix: string
}

export type AnalysisResponse = {
  score: number
  summary: string
  matched_skills: string[]
  missing_skills: string[]
  suggestions: Suggestion[]
}