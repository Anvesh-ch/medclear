import { useState } from 'react'
import './ResultCard.css'

const TRUNCATE_LENGTH = 300

function ResultCard({ title, emoji, text, borderColor, delay = 0, index = '01' }) {
  const [expanded, setExpanded] = useState(false)

  if (!text) return null

  const needsTruncation = text.length > TRUNCATE_LENGTH
  const displayText = expanded || !needsTruncation
    ? text
    : text.slice(0, TRUNCATE_LENGTH) + '…'

  return (
    <div
      className={`result-card border-${borderColor}`}
      style={{ animation: `fadeIn 0.35s ease-out ${delay}ms both` }}
    >
      <div className="card-header">
        <span className="card-index">[ {index} ]</span>
        <h3 className="card-title">{title}</h3>
      </div>
      <p className="card-text">{displayText}</p>
      {needsTruncation && (
        <button
          className="toggle-btn"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'collapse' : 'read more'}
        </button>
      )}
    </div>
  )
}

export default ResultCard
