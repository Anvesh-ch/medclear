import './LoadingBar.css'

function LoadingBar() {
  return (
    <div className="loading-container">
      <div className="loading-bar-track">
        <div className="loading-bar-fill" />
      </div>
      <p className="loading-text">Searching FDA database…</p>
    </div>
  )
}

export default LoadingBar
