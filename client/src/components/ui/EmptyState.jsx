export default function EmptyState({ icon, title, children, action, className = '' }) {
  return (
    <div className={`empty ${className}`.trim()}>
      <div className="empty-icon">{icon}</div>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
