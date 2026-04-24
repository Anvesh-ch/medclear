import { useMemo } from 'react'
import './RiskGauge.css'

const RISK_KEYWORDS = [
  'fatal', 'death', 'severe', 'serious',
  'hospitalization', 'contraindicated', 'life-threatening'
]

function computeRiskLevel(text) {
  if (!text) return { count: 0, level: 1 }

  const lowerText = text.toLowerCase()
  let count = 0

  RISK_KEYWORDS.forEach((keyword) => {
    const regex = new RegExp(keyword, 'gi')
    const matches = lowerText.match(regex)
    if (matches) {
      count += matches.length
    }
  })

  let level
  if (count <= 1) level = 1
  else if (count <= 3) level = 2
  else if (count <= 5) level = 3
  else if (count <= 8) level = 4
  else level = 5

  return { count, level }
}

function getGaugeColor(level) {
  if (level <= 2) return '#10b981'
  if (level === 3) return '#f59e0b'
  if (level === 4) return '#f97316'
  return '#ef4444'
}

function getLevelLabel(level) {
  switch (level) {
    case 1: return 'Very Low'
    case 2: return 'Low'
    case 3: return 'Moderate'
    case 4: return 'High'
    case 5: return 'Very High'
    default: return 'Unknown'
  }
}

function RiskGauge({ warnings, adverseReactions }) {
  const combinedText = [warnings || '', adverseReactions || ''].join(' ')

  const { level } = useMemo(() => computeRiskLevel(combinedText), [combinedText])

  const color = getGaugeColor(level)
  const fillWidth = `${(level / 5) * 100}%`
  const levelLabel = getLevelLabel(level)

  return (
    <div className="risk-gauge-container">
      <div className="risk-header">
        <span className="risk-label">FDA Risk Signal</span>
        <span className="risk-info-icon">
          i
          <span className="risk-tooltip">
            Based on frequency of high-risk terms in the FDA label. Not a clinical rating.
          </span>
        </span>
        <span className="risk-level-label" style={{ color }}>
          Level {level} — {levelLabel}
        </span>
      </div>
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{ width: fillWidth, background: color }}
        />
      </div>
      <div className="gauge-segments">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  )
}

export default RiskGauge
