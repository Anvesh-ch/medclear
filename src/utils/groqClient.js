const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function askMedClearAI({ question, labelData, drugName }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY_NOT_SET')
  }

  const systemPrompt = `You are MedClear AI, a helpful medication assistant. Answer the user's question using ONLY the FDA drug label data provided below. Be concise, plain-English, and never give specific dosage advice or replace a doctor. If the answer is not found in the label data, say: "This information is not in the FDA label — please consult your pharmacist."

Drug: ${drugName}

FDA Label Data:
${labelData}`

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      max_tokens: 300,
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'No response received.'
}
