export default function StatCard({ label, icon, value, foot, valueStyle }) {
  return (
    <div className="stat">
      <div className="stat-top">
        {label} <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-value" style={valueStyle}>
        {value}
      </div>
      <div className="stat-foot">{foot}</div>
    </div>
  );
}
