import { useState } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch, placeholder, id }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <div className="search-bar-wrapper">
      <form className="search-bar" onSubmit={handleSubmit}>
        <span className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id={id}
          aria-label="Search medication"
        />
        <button type="submit" className="search-submit">
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
