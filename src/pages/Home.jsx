export default function Home() {
  return (
    <section className="page dashboard-page">
      <div className="mobile-panel">
        <header className="dashboard-header">
          <button type="button" className="back-button">←</button>
          <h1>वित्त सलाह / Finance Coach</h1>
        </header>

        <div className="score-card">
          <div>
            <span className="score-label">72 / 100 pts</span>
            <div className="score-subtitle">स्तर: Intermediate</div>
          </div>
          <div className="stars">⭐⭐⭐</div>
        </div>

        <div className="module-list">
          <div className="module-card">
            <div className="module-icon">🏦</div>
            <div>
              <div className="module-title">Banking Basics</div>
              <div className="module-meta">10 प्रश्न • Easy • 85%</div>
            </div>
          </div>
          <div className="module-card">
            <div className="module-icon">📈</div>
            <div>
              <div className="module-title">Investments 101</div>
              <div className="module-meta">12 प्रश्न • Medium • Start Now</div>
            </div>
          </div>
          <div className="module-card">
            <div className="module-icon">🏠</div>
            <div>
              <div className="module-title">Loans & EMI</div>
              <div className="module-meta">8 प्रश्न • Medium</div>
            </div>
          </div>
          <div className="module-card">
            <div className="module-icon">🧾</div>
            <div>
              <div className="module-title">Tax Planning</div>
              <div className="module-meta">15 प्रश्न • Hard</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
