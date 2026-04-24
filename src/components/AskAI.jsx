import { useState, useRef, useEffect } from 'react'
import { askMedClearAI } from '../utils/groqClient'
import './AskAI.css'

const MAX_QUESTIONS = 5

function AskAI({ labelData, drugName }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Reset chat when drug changes
  useEffect(() => {
    setMessages([])
    setQuestionCount(0)
    setInput('')
    setIsTyping(false)
  }, [drugName])

  const handleSend = async (e) => {
    e.preventDefault()
    const question = input.trim()
    if (!question || isTyping || questionCount >= MAX_QUESTIONS) return

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setInput('')
    setIsTyping(true)
    setQuestionCount(prev => prev + 1)

    try {
      const answer = await askMedClearAI({
        question,
        labelData,
        drugName,
      })
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
    } catch (err) {
      const errorMsg = err.message === 'GROQ_API_KEY_NOT_SET'
        ? 'Please add your Groq API key to the .env file (VITE_GROQ_API_KEY) to use this feature.'
        : 'MedClear AI is unavailable right now. Please consult your pharmacist.'
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg, isError: true }])
    } finally {
      setIsTyping(false)
    }
  }

  const remaining = MAX_QUESTIONS - questionCount

  return (
    <div className="ask-ai-section">
      <div className="ask-ai-header">
        <span className="ask-ai-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.1L2 9.4h7.6z"/>
          </svg>
        </span>
        <h3 className="ask-ai-title">Ask MedClear AI</h3>
        {questionCount > 0 && (
          <span className="ask-ai-counter">
            {remaining} question{remaining !== 1 ? 's' : ''} remaining
          </span>
        )}
      </div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role} ${msg.isError ? 'error' : ''}`}>
              {msg.role === 'assistant' && (
                <span className="bot-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.1L2 9.4h7.6z"/>
                  </svg>
                </span>
              )}
              <p className="chat-text">{msg.content}</p>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble assistant">
              <span className="bot-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.1L2 9.4h7.6z"/>
                </svg>
              </span>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Input Bar */}
      <form className="ask-ai-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          className="ask-ai-input"
          placeholder={
            questionCount >= MAX_QUESTIONS
              ? 'Question limit reached for this session'
              : 'Ask anything about this medication...'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={questionCount >= MAX_QUESTIONS || isTyping}
          id="ask-ai-input"
        />
        <button
          type="submit"
          className="ask-ai-send"
          disabled={!input.trim() || questionCount >= MAX_QUESTIONS || isTyping}
          id="ask-ai-send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>

      <p className="ask-ai-disclaimer">
        MedClear AI answers using FDA label data only. Not a substitute for medical advice.
      </p>
    </div>
  )
}

export default AskAI
