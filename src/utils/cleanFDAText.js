/**
 * Cleans raw FDA label text by removing section numbers, cross-references,
 * and clinical formatting artifacts. This is a local regex-based pass
 * that runs before display — no API call needed.
 */
export function cleanFDAText(raw) {
  if (!raw || typeof raw !== 'string') return raw

  let text = raw

  // Remove leading section numbers like "11 DESCRIPTION", "1 INDICATIONS & USAGE", "6.1 Clinical..."
  text = text.replace(/^\s*\d+(\.\d+)?\s+/gm, '')

  // Remove inline section number references like "( 5.1 )", "( 6.1 )"
  text = text.replace(/\(\s*\d+(\.\d+)?\s*\)/g, '')

  // Remove cross-reference brackets like "[ see Warnings and Precautions (5.1) ]"
  text = text.replace(/\[\s*see\s+[^\]]+\]/gi, '')

  // Remove standalone "see Section X.X" references
  text = text.replace(/see\s+(Boxed\s+Warning|Warnings?\s+and\s+Precautions?|Contraindications?|Adverse\s+Reactions?)\s*(\(\s*\d+(\.\d+)?\s*\))?/gi, '')

  // Remove header-like all-caps lines that are just labels: "DESCRIPTION", "INDICATIONS AND USAGE", etc.
  text = text.replace(/^(DESCRIPTION|INDICATIONS?\s*(AND|&)\s*USAGE|ADVERSE\s+REACTIONS?|DRUG\s+INTERACTIONS?|WARNINGS?\s*(AND|&)\s*PRECAUTIONS?|CONTRAINDICATIONS?|DOSAGE\s*(AND|&)\s*ADMINISTRATION)\s*/gim, '')

  // Remove reporting lines: "To report SUSPECTED ADVERSE REACTIONS..."
  text = text.replace(/To report SUSPECTED ADVERSE REACTIONS[^.]*\./gi, '')

  // Remove phone numbers and URL patterns
  text = text.replace(/\d{1,2}-\d{3}-\d{3}-\d{4}/g, '')
  text = text.replace(/www\.\S+/gi, '')

  // Remove "Table X:" references
  text = text.replace(/Table\s+\d+:?\s*/gi, '')

  // Clean up multiple spaces and newlines
  text = text.replace(/\s{2,}/g, ' ')
  text = text.trim()

  return text
}
