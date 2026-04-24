import { useState, useCallback } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import DrugResult from './components/DrugResult'
import LoadingBar from './components/LoadingBar'
import ErrorCard from './components/ErrorCard'

const fetchDrugData = async (drugName) => {
  const encodedName = encodeURIComponent(drugName.toUpperCase())

  // Primary: search by brand name
  let url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodedName}"&limit=1`
  let res = await fetch(url)

  if (res.ok) {
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      return data.results[0]
    }
  }

  // Fallback: search by generic name
  url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodedName}"&limit=1`
  res = await fetch(url)

  if (res.ok) {
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      return data.results[0]
    }
  }

  return null
}

function App() {
  const [drug1, setDrug1] = useState({ data: null, loading: false, error: false, searched: false, name: '' })
  const [drug2, setDrug2] = useState({ data: null, loading: false, error: false, searched: false, name: '' })
  const [showCompare, setShowCompare] = useState(false)

  const handleSearch = useCallback(async (drugName, slot) => {
    const setState = slot === 1 ? setDrug1 : setDrug2

    setState({ data: null, loading: true, error: false, searched: true, name: drugName })

    try {
      const result = await fetchDrugData(drugName)
      if (result) {
        setState({ data: result, loading: false, error: false, searched: true, name: drugName })
      } else {
        setState({ data: null, loading: false, error: true, searched: true, name: drugName })
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setState({ data: null, loading: false, error: true, searched: true, name: drugName })
    }
  }, [])

  const hasResults = drug1.searched || drug2.searched

  return (
    <div className="app-container">
      {/* Hero */}
      <header className="hero">
        <h1 className="hero-logo">
          Med<span>Clear</span>
        </h1>
        <p className="hero-tagline">Your medication label, in plain English</p>
      </header>

      {/* Primary Search */}
      <section className="search-section">
        <SearchBar
          onSearch={(name) => handleSearch(name, 1)}
          placeholder="Search any medication (e.g. ibuprofen, metformin)..."
          id="search-primary"
        />

        {showCompare && (
          <SearchBar
            onSearch={(name) => handleSearch(name, 2)}
            placeholder="Compare with another medication..."
            id="search-compare"
          />
        )}
      </section>

      {/* Compare Button */}
      {drug1.data && !showCompare && (
        <div className="compare-btn-container">
          <button
            className="compare-btn"
            onClick={() => setShowCompare(true)}
            id="compare-toggle"
          >
            <span>+</span> Compare with another medication
          </button>
        </div>
      )}

      {/* Results */}
      <main className="results-area">
        {(drug1.searched || drug2.searched) && (
          <div className={`results-grid ${showCompare && drug2.searched ? 'compare' : 'single'}`}>
            {/* Drug 1 Column */}
            {drug1.searched && (
              <div className="drug-column">
                {showCompare && drug1.name && (
                  <div className="drug-name-chip">{drug1.name}</div>
                )}
                {drug1.loading && <LoadingBar />}
                {drug1.error && <ErrorCard />}
                {drug1.data && <DrugResult data={drug1.data} drugName={drug1.name} />}
              </div>
            )}

            {/* Drug 2 Column */}
            {showCompare && drug2.searched && (
              <div className="drug-column">
                {drug2.name && (
                  <div className="drug-name-chip">{drug2.name}</div>
                )}
                {drug2.loading && <LoadingBar />}
                {drug2.error && <ErrorCard />}
                {drug2.data && <DrugResult data={drug2.data} drugName={drug2.name} />}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Data sourced from the U.S. FDA OpenFDA database. Not medical advice. Always consult your pharmacist or doctor.
        </p>
        {hasResults && (
          <button className="print-btn" onClick={() => window.print()} id="print-btn">
            🖨️ Print Summary
          </button>
        )}
      </footer>
    </div>
  )
}

export default App
