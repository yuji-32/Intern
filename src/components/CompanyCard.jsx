import MiniBox from "./MiniBox";

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
  return (
    <div className="company-card">
      <div className="company-head">
        <div>
          <div className="company-name">{company.companyName}</div>
          <div className="company-role">{company.internshipTitle}</div>
        </div>

        <div className="score-pill">{company.score}点</div>
      </div>

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

      <div className="mini-grid">
        <MiniBox label="年収" value={company.ratings.salary} />
        <MiniBox label="大手" value={company.ratings.companySize} />
        <MiniBox label="勤務地" value={company.ratings.location} />
        <MiniBox label="働き方" value={company.ratings.workStyle} />
        <MiniBox label="興味" value={company.ratings.interest} />
        <MiniBox label="受かりたさ" value={company.ratings.motivation} />
      </div>

      <div className="card-actions" style={{ marginTop: 16 }}>
        {company.url && (
          <a
            className="link-btn"
            href={company.url}
            target="_blank"
            rel="noreferrer"
          >
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