export default function Savings() {
  return (
    <section className="page savings-page">
      <div className="mobile-panel">
        <header className="dashboard-header">
          <button type="button" className="back-button">←</button>
          <h1>बचत / Savings</h1>
        </header>

        <div className="savings-summary-card">
          <div className="savings-title">₹24,500</div>
          <div className="savings-subtitle">जमा बचत • Total Savings</div>
          <div className="savings-change">+₹4,500 this month</div>
        </div>

        <div className="mini-cards">
          <div className="mini-card">
            <div>₹33,320</div>
            <div>कुल आय</div>
          </div>
          <div className="mini-card">
            <div>₹11,250</div>
            <div>कुल खर्च</div>
          </div>
        </div>

        <div className="segment-tabs">
          <button type="button" className="segment active">Overview</button>
          <button type="button" className="segment">Transactions</button>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>बचत ग्राफ / Savings Growth</div>
            <span>6 Months</span>
          </div>
          <div className="chart-graphic">
            <div className="chart-line" />
          </div>
        </div>

        <div className="pot-card">
          <div className="pot-title">Emergency Fund</div>
          <div className="pot-meta">₹15,000 of ₹30,000</div>
          <div className="progress-bar"><span style={{ width: '50%' }} /></div>
          <div className="pot-status">50%</div>
        </div>
      </div>
    </section>
  )
}
