export default function Goals() {
  return (
    <section className="page goals-page">
      <div className="mobile-panel">
        <header className="dashboard-header">
          <button type="button" className="back-button">←</button>
          <h1>लक्ष्य / Goals</h1>
        </header>

        <div className="goal-summary-grid">
          <div className="goal-chip">3 लक्ष्य</div>
          <div className="goal-chip">1 पूर्ण</div>
          <div className="goal-chip">₹4.3L बचत</div>
        </div>

        <div className="goal-card">
          <div className="goal-card-top">
            <div>
              <div className="goal-card-title">Dream Home</div>
              <div className="goal-card-subtitle">Property</div>
            </div>
            <div className="goal-badge">24%</div>
          </div>
          <div className="goal-progress-bar"><span style={{ width: '24%' }} /></div>
          <div className="goal-meta">₹120,000 of ₹500,000</div>
          <div className="goal-footer">₹380,000 remaining • Dec 2028</div>
        </div>

        <div className="goal-card">
          <div className="goal-card-top">
            <div>
              <div className="goal-card-title">Child's Education</div>
              <div className="goal-card-subtitle">Education</div>
            </div>
            <div className="goal-badge">45%</div>
          </div>
          <div className="goal-progress-bar"><span style={{ width: '45%' }} /></div>
          <div className="goal-meta">₹45,000 of ₹100,000</div>
          <div className="goal-footer">₹55,000 remaining • Jun 2027</div>
        </div>
      </div>
    </section>
  )
}
