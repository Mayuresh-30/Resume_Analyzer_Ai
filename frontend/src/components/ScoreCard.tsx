import type { CSSProperties } from 'react'

type ScoreCardProps = { score: number }

export default function ScoreCard({ score }: ScoreCardProps) {
  const scoreColor = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'

  return (
    <div className="score-card">
      <div className="score-ring" style={{ '--score': `${score}%`, '--score-color': scoreColor } as CSSProperties}>
        <span>{score}</span>
      </div>
      <div>
        <p className="eyebrow">Resume score</p>
        <p className="score-caption">out of 100</p>
      </div>
    </div>
  )
}