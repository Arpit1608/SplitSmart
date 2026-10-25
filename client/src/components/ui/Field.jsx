// Label + input wrapper used in every form. Children is the actual <input>/<select>.
export default function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <span className="tiny muted">{hint}</span>}
    </div>
  );
}
