export default function MiniBox({ label, value }) {
  return (
    <div className="mini-box">
      <div className="mini-label">{label}</div>
      <div className="mini-value">{value}</div>
    </div>
  );
}