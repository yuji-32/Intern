export default function SimpleRow({ title, subtitle, badgeClass, badgeText }) {
  return (
    <div className="row-item">
      <div>
        <div className="row-title">{title}</div>
        <div className="row-sub">{subtitle}</div>
      </div>
      <span className={`badge ${badgeClass}`}>{badgeText}</span>
    </div>
  );
}