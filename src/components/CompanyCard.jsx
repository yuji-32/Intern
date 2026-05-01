export default function CompanyCard({
  company,
  onEdit,
  onDelete,
  onAddEvent,
  deadlineBadgeClass,
  deadlineText,
  formatDate,
  getStatusBadgeClass,
}) {
  const nextEvent = company.relatedEvents?.length
    ? [...company.relatedEvents].sort((a, b) => {
        return (
          new Date(`${a.date}T${a.time || "23:59"}`) -
          new Date(`${b.date}T${b.time || "23:59"}`)
        );
      })[0]
    : null;

  return (
    <div className="company-card">
      <div className="company-head">
        <div>
          <div className="company-name">{company.companyName}</div>
          <div className="company-role">{company.internshipTitle}</div>
        </div>

        <div className="score-pill small">志望度 {company.score}</div>
      </div>

      {nextEvent && (
        <div className="next-event-box">
          <div className="next-event-label">次の予定</div>
          <div className="next-event-title">{nextEvent.type}</div>
          <div className="next-event-date">
            {nextEvent.date}
            {nextEvent.time ? ` ${nextEvent.time}` : ""}
          </div>
        </div>
      )}

      <div className="tag-row">
        <span className={`badge ${getStatusBadgeClass(company.status)}`}>
          {company.status}
        </span>
        <span className={`badge ${deadlineBadgeClass(company.daysLeft)}`}>
          {deadlineText(company.daysLeft)}
        </span>
        <span className="badge badge-neutral">
          {company.locationText || "勤務地未設定"}
        </span>
        <span className={`badge ${company.paid ? "badge-green" : "badge-neutral"}`}>
          {company.paid ? "報酬あり" : "報酬なし/不明"}
        </span>
        <span className="badge badge-blue">
          予定 {company.relatedEvents?.length || 0}件
        </span>
      </div>

      <div className="info-list">
        <div>
          <strong>締切：</strong>
          {formatDate(company.deadline)}
        </div>
        <div>
          <strong>応募サイト：</strong>
          {company.siteName || "未設定"}
        </div>
        {company.memo && (
          <div>
            <strong>メモ：</strong>
            {company.memo}
          </div>
        )}
      </div>

      <div className="card-actions" style={{ marginTop: 16 }}>
        {company.url && (
          <a className="link-btn" href={company.url} target="_blank" rel="noreferrer">
            募集ページを見る
          </a>
        )}

        <button className="link-btn" onClick={onAddEvent}>
          予定追加
        </button>

        <button className="link-btn" onClick={onEdit}>
          編集
        </button>

        <button
          className="link-btn"
          style={{ color: "#dc2626", borderColor: "#fecaca" }}
          onClick={onDelete}
        >
          削除
        </button>
      </div>
    </div>
  );
}