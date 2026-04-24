import './ErrorCard.css'

function ErrorCard() {
  return (
    <div className="error-card">
      <h3 className="error-title">Medication not found</h3>
      <p className="error-text">
        We couldn't find this in the FDA database. Try the generic name — for example, "ibuprofen" instead of "Advil".
      </p>
      <span className="error-hint">
        Tip: Use the drug's chemical name
      </span>
    </div>
  )
}

export default ErrorCard
