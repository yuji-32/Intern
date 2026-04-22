export default function WeightCard({ label, value, onChange }) {
  return (
    <div className="weight-card">
      <div className="label" style={{ marginBottom: 10 }}>
        {label}
      </div>

      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%" }}
      />

      <div className="weight-value">×{value}</div>
    </div>
  );
}