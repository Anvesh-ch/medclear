import './DrugResult.css'
import ResultCard from './ResultCard'
import RiskGauge from './RiskGauge'
import AskAI from './AskAI'
import { cleanFDAText } from '../utils/cleanFDAText'

function getField(data, ...keys) {
  for (const key of keys) {
    if (data[key] && Array.isArray(data[key]) && data[key][0]) {
      return data[key][0]
    }
  }
  return null
}

function DrugResult({ data, drugName }) {
  const rawDescription = getField(data, 'description', 'purpose')
  const rawUsage = getField(data, 'indications_and_usage')
  const rawSideEffects = getField(data, 'adverse_reactions')
  const rawInteractions = getField(data, 'drug_interactions')
  const rawWarnings = getField(data, 'warnings_and_cautions', 'warnings')

  // Clean all fields for display
  const description = cleanFDAText(rawDescription)
  const usage = cleanFDAText(rawUsage)
  const sideEffects = cleanFDAText(rawSideEffects)
  const interactions = cleanFDAText(rawInteractions)
  const warnings = cleanFDAText(rawWarnings)

  // Build concatenated label data for AI context (use raw data for full context)
  const labelData = [
    rawDescription && `DESCRIPTION: ${rawDescription}`,
    rawUsage && `INDICATIONS AND USAGE: ${rawUsage}`,
    rawSideEffects && `ADVERSE REACTIONS: ${rawSideEffects}`,
    rawInteractions && `DRUG INTERACTIONS: ${rawInteractions}`,
    rawWarnings && `WARNINGS: ${rawWarnings}`,
  ].filter(Boolean).join('\n\n')

  return (
    <div className="drug-result-cards">
      <RiskGauge warnings={rawWarnings} adverseReactions={rawSideEffects} />

      <ResultCard
        title="What is this?"
        text={description}
        borderColor="blue"
        delay={0}
        index="01"
      />
      <ResultCard
        title="What is it used for?"
        text={usage}
        borderColor="green"
        delay={80}
        index="02"
      />
      <ResultCard
        title="Side Effects"
        text={sideEffects}
        borderColor="yellow"
        delay={160}
        index="03"
      />
      <ResultCard
        title="Do Not Mix With"
        text={interactions}
        borderColor="orange"
        delay={240}
        index="04"
      />
      <ResultCard
        title="Call a Doctor If"
        text={warnings}
        borderColor="red"
        delay={320}
        index="05"
      />

      <AskAI labelData={labelData} drugName={drugName || 'this medication'} />
    </div>
  )
}

export default DrugResult
