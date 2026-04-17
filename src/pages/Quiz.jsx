export default function Quiz() {
  return (
    <section className="page quiz-page">
      <div className="mobile-panel">
        <header className="dashboard-header">
          <button type="button" className="back-button">←</button>
          <h1>वित्त क्विज़ / Finance Quiz</h1>
        </header>

        <div className="quiz-score-card">
          <div className="quiz-score">72 / 100 pts</div>
          <div className="quiz-level">Intermediate</div>
          <div className="quiz-stars">⭐⭐⭐</div>
        </div>

        <div className="module-list">
          <div className="module-card">
            <div className="module-icon">🏦</div>
            <div>
              <div className="module-title">Banking Basics</div>
              <div className="module-meta">10 questions</div>
            </div>
          </div>
          <div className="module-card">
            <div className="module-icon">📈</div>
            <div>
              <div className="module-title">Investments 101</div>
              <div className="module-meta">12 questions</div>
            </div>
          </div>
          <div className="module-card">
            <div className="module-icon">🏠</div>
            <div>
              <div className="module-title">Loans & EMI</div>
              <div className="module-meta">8 questions</div>
            </div>
          </div>
          <div className="module-card">
            <div className="module-icon">🧾</div>
            <div>
              <div className="module-title">Tax Planning</div>
              <div className="module-meta">15 questions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
