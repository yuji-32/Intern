import StatCard from "../components/StatCard";
import SimpleRow from "../components/SimpleRow";

export default function DashboardPage({ stats, formatDate, deadlineBadgeClass, deadlineText }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div className="panel-title">まず何をすればいいか</div>
        <div className="panel-subtitle">
          この画面では全体状況を見る。次の行動は上の3つのボタンから選べる。
        </div>
      </div>

      <div className="grid-stats">
        <StatCard label="登録企業" value={stats.total} />
        <StatCard label="応募済み" value={stats.applied} />
        <StatCard label="面接予定" value={stats.interview} />
        <StatCard label="合格" value={stats.passed} />
        <StatCard label="平均志望度" value={`${stats.average}点`} />
      </div>

      <div style={{ height: 16 }} />

      <div className="grid-2">
        <div className="box">
          <div className="box-title">締切が近い企業</div>
          <div className="box-subtitle">見落とさないように先に確認する。</div>
          <div className="row-list">
            {stats.urgentThree.length === 0 ? (
              <div className="empty">表示する企業がありません。</div>
            ) : (
              stats.urgentThree.map((company) => (
                <SimpleRow
                  key={company.id}
                  title={company.companyName}
                  subtitle={formatDate(company.deadline)}
                  badgeClass={deadlineBadgeClass(company.daysLeft)}
                  badgeText={deadlineText(company.daysLeft)}
                />
              ))
            )}
          </div>
        </div>

        <div className="box">
          <div className="box-title">直近の予定</div>
          <div className="box-subtitle">ESや面接の予定をここで確認する。</div>
          <div className="row-list">
            {stats.upcomingEvents.length === 0 ? (
              <div className="empty">予定はまだありません。</div>
            ) : (
              stats.upcomingEvents.map((event) => (
                <SimpleRow
                  key={event.id}
                  title={event.title}
                  subtitle={`${event.companyName || "企業名なし"} / ${event.date}${event.time ? ` ${event.time}` : ""}`}
                  badgeClass="badge-blue"
                  badgeText={event.type}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}