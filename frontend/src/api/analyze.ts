import type { AnalysisResponse } from '../types'

export async function analyzeResume(file: File, jobDescription: string): Promise<AnalysisResponse> {
  const formData = new FormData()
  formData.append('resume', file)
  formData.append('job_description', jobDescription)

  const response = await fetch('/api/analyze', { method: 'POST', body: formData })
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.detail ?? 'Resume analysis failed. Please try again.')
  }
  return response.json() as Promise<AnalysisResponse>
}