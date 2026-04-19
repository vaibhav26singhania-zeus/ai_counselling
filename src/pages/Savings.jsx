import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const STORAGE_KEY = 'arthbot_savings'

export default function Savings() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const [transactions, setTransactions] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddForm, setShowAddForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('income')
  const [category, setCategory] = useState('salary')
  const [emergencyFundGoal, setEmergencyFundGoal] = useState(30000)
  const [emergencyFundCurrent, setEmergencyFundCurrent] = useState(15000)

  // Load transactions from localStorage
  useEffect(() => {
    if (user) {
      const storageKey = `${STORAGE_KEY}_${user.id}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setTransactions(data.transactions || [])
          setEmergencyFundGoal(data.emergencyFundGoal || 30000)
          setEmergencyFundCurrent(data.emergencyFundCurrent || 15000)
        } catch (error) {
          console.error('Failed to load savings data:', error)
        }
      }
    }
  }, [user])

  // Save to localStorage
  useEffect(() => {
    if (user) {
      const storageKey = `${STORAGE_KEY}_${user.id}`
      const data = {
        transactions,
        emergencyFundGoal,
        emergencyFundCurrent
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
    }
  }, [transactions, emergencyFundGoal, emergencyFundCurrent, user])

  const handleAddTransaction = (e) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      alert(language === 'hi' ? 'कृपया मान्य राशि दर्ज करें' : 'Please enter a valid amount')
      return
    }

    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      description: description || (language === 'hi' ? 'कोई विवरण नहीं' : 'No description'),
      type,
      category,
      date: new Date().toISOString(),
    }

    setTransactions([newTransaction, ...transactions])
    
    // Reset form
    setAmount('')
    setDescription('')
    setShowAddForm(false)
  }

  const handleDeleteTransaction = (id) => {
    if (window.confirm(language === 'hi' ? 'क्या आप इस लेनदेन को हटाना चाहते हैं?' : 'Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSavings = totalIncome - totalExpense

  // Calculate this month's savings
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const thisMonthSavings = transactions
    .filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    })
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)

  // Get last 6 months data for chart
  const getLast6MonthsData = () => {
    const months = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date)
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear()
      })
      
      const savings = monthTransactions.reduce((sum, t) => 
        sum + (t.type === 'income' ? t.amount : -t.amount), 0
      )
      
      months.push({ month: date.getMonth(), savings })
    }
    
    return months
  }

  const chartData = getLast6MonthsData()
  const maxSavings = Math.max(...chartData.map(d => d.savings), 1)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const emergencyFundPercentage = (emergencyFundCurrent / emergencyFundGoal) * 100

  const categories = {
    income: {
      hi: ['वेतन', 'व्यवसाय', 'निवेश', 'उपहार', 'अन्य'],
      en: ['Salary', 'Business', 'Investment', 'Gift', 'Other']
    },
    expense: {
      hi: ['भोजन', 'परिवहन', 'मनोरंजन', 'बिल', 'खरीदारी', 'अन्य'],
      en: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other']
    }
  }

  return (
    <section className="page savings-page-new">
      <div className="savings-container">
        {/* Header with gradient */}
        <div className="savings-header">
          <button className="back-btn" onClick={() => window.history.back()}>←</button>
          <h1>{language === 'hi' ? 'बचत / Savings' : 'Savings'}</h1>
          
          <div className="total-savings">
            <div className="savings-amount">{formatCurrency(totalSavings)}</div>
            <div className="savings-label">
              {language === 'hi' ? 'कुल बचत - Total Savings' : 'Total Savings'}
            </div>
            <div className="month-savings">
              +{formatCurrency(thisMonthSavings)} {language === 'hi' ? 'इस महीने' : 'this month'}
            </div>
          </div>

          {/* Income and Expense Cards */}
          <div className="summary-cards">
            <div className="summary-card-small">
              <div className="card-amount">{formatCurrency(totalIncome)}</div>
              <div className="card-label">{language === 'hi' ? 'कुल आय' : 'Total Income'}</div>
            </div>
            <div className="summary-card-small">
              <div className="card-amount">{formatCurrency(totalExpense)}</div>
              <div className="card-label">{language === 'hi' ? 'कुल खर्च' : 'Total Expense'}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="savings-content">
          {activeTab === 'overview' ? (
            <>
              {/* Savings Growth Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>{language === 'hi' ? 'बचत ग्राफ / Savings Growth' : 'Savings Growth'}</h3>
                  <span className="chart-period">6 Months</span>
                </div>
                <div className="chart">
                  <svg width="100%" height="120" viewBox="0 0 500 120">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 450 + 25
                        const y = 100 - (d.savings / maxSavings) * 70
                        return `${x},${y}`
                      }).join(' ')}
                    />
                    {chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 450 + 25
                      const y = 100 - (d.savings / maxSavings) * 70
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#22c55e"
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Emergency Fund */}
              <div className="emergency-fund-card">
                <h3>Emergency Fund</h3>
                <div className="fund-amount">
                  {formatCurrency(emergencyFundCurrent)} {language === 'hi' ? 'का' : 'of'} {formatCurrency(emergencyFundGoal)}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(emergencyFundPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="progress-label">{Math.round(emergencyFundPercentage)}%</div>
              </div>
            </>
          ) : (
            <>
              {/* Add Transaction Button */}
              <button 
                className="add-transaction-btn-new"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '✕ Close' : '+ Add Transaction'}
              </button>

              {/* Add Transaction Form */}
              {showAddForm && (
                <div className="transaction-form-new">
                  <form onSubmit={handleAddTransaction}>
                    <div className="form-row">
                      <label className="radio-group">
                        <input
                          type="radio"
                          value="income"
                          checked={type === 'income'}
                          onChange={(e) => setType(e.target.value)}
                        />
                        <span className="radio-label">{language === 'hi' ? '📈 आय' : '📈 Income'}</span>
                      </label>
                      <label className="radio-group">
                        <input
                          type="radio"
                          value="expense"
                          checked={type === 'expense'}
                          onChange={(e) => setType(e.target.value)}
                        />
                        <span className="radio-label">{language === 'hi' ? '📉 व्यय' : '📉 Expense'}</span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>{language === 'hi' ? 'राशि (₹)' : 'Amount (₹)'}</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1000"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>{language === 'hi' ? 'श्रेणी' : 'Category'}</label>
                      <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {categories[type][language].map((cat, idx) => (
                          <option key={idx} value={cat.toLowerCase()}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{language === 'hi' ? 'विवरण' : 'Description'}</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={language === 'hi' ? 'विवरण दर्ज करें...' : 'Enter description...'}
                      />
                    </div>

                    <button type="submit" className="submit-btn">
                      {language === 'hi' ? 'जोड़ें' : 'Add'}
                    </button>
                  </form>
                </div>
              )}

              {/* Transactions List */}
              <div className="transactions-list-new">
                {transactions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>{language === 'hi' ? 'कोई लेनदेन नहीं' : 'No transactions yet'}</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className={`transaction-item-new ${transaction.type}`}
                    >
                      <div className="transaction-icon">
                        {transaction.type === 'income' ? '📈' : '📉'}
                      </div>
                      <div className="transaction-details">
                        <div className="transaction-desc">{transaction.description}</div>
                        <div className="transaction-meta">
                          <span className="transaction-category">{transaction.category}</span>
                          <span className="transaction-date">{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                      <div className="transaction-right">
                        <div className={`transaction-amount ${transaction.type}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                        <button 
                          className="delete-btn-small"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
