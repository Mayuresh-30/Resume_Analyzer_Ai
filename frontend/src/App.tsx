import { useState } from 'react'
import { analyzeResume } from './api/analyze'
import ScoreCard from './components/ScoreCard'
import Suggestions from './components/Suggestions'
import UploadForm from './components/UploadForm'
import type { AnalysisResponse } from './types'

export default function App() {
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleAnalyze(file: File, jobDescription: string) {
    setBusy(true)
    setResult(null)
    try {
      setResult(await analyzeResume(file, jobDescription))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Resume Analyzer home"><span>R</span> / REVIEW</a>
        <span className="topbar-note">CAREER TOOLS <i /> RESUME REVIEW</span>
      </header>
      <section className="intro">
        <p className="eyebrow">A clearer next step</p>
        <h1>Make your resume<br /><em>work harder.</em></h1>
        <p className="intro-copy">Get a thoughtful read on what is landing, what is missing, and where to focus next.</p>
      </section>
      <div className="workspace">
        <section className="input-panel" aria-labelledby="upload-heading">
          <div className="section-heading">
            <span className="step-number">01</span>
            <div><h2 id="upload-heading">Add your resume</h2><p>Start with a current PDF or Word document.</p></div>
          </div>
          <UploadForm busy={busy} onAnalyze={handleAnalyze} />
          <p className="privacy-note"><span aria-hidden="true">◎</span> Your resume is reviewed for this session and not stored.</p>
        </section>
        <section className="results-panel" aria-labelledby="results-heading" aria-live="polite">
          <div className="section-heading">
            <span className="step-number">02</span>
            <div><h2 id="results-heading">Your review</h2><p>Specific feedback, not just a score.</p></div>
          </div>
          {result ? (
            <div className="results-content">
              <ScoreCard score={result.score} />
              <p className="summary-text">{result.summary}</p>
              <Suggestions title="Suggestions" items={result.suggestions} />
              <section className="skills-grid">
                <div className="skills-section matched-skills">
                  <h3>Matched skills</h3>
                  <div className="skill-list">{result.matched_skills.length ? result.matched_skills.map((skill) => <span key={skill}>{skill}</span>) : <p className="empty-note">None identified.</p>}</div>
                </div>
                <div className="skills-section missing-skills">
                  <h3>Missing skills</h3>
                  <div className="skill-list">{result.missing_skills.length ? result.missing_skills.map((skill) => <span key={skill}>{skill}</span>) : <p className="empty-note">None identified.</p>}</div>
                </div>
              </section>
            </div>
          ) : (
            <div className="empty-results">
              <span className="empty-symbol" aria-hidden="true">✳</span>
              <p>{busy ? 'Reading your resume and preparing feedback…' : 'Your feedback will appear here after your resume is analyzed.'}</p>
              <span className="empty-rule" />
            </div>
          )}
        </section>
      </div>
      <footer><span>RESUME ANALYZER</span><span>BUILT FOR YOUR NEXT MOVE</span></footer>
    </main>
  )
}