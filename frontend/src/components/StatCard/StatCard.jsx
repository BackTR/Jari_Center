import './StatCard.css'

export default function StatCard({ icon, label, value, color = 'blue' }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-icon">
        {icon}
      </div>
      <div className="stat-card-content">
        <span className="stat-card-label">{label}</span>
        <strong className="stat-card-value">{value}</strong>
      </div>
    </div>
  )
}
