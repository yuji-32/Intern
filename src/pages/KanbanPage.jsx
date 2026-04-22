export default function KanbanPage({
  companiesWithMeta,
  statusOptions,
  handleEdit,
  deadlineBadgeClass,
  deadlineText,
  getStatusBadgeClass,
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div className="panel-title">選考ボード</div>
        <div className="panel-subtitle">
          今どの企業がどの段階かを確認する。
        </div>
      </div>

      <div className="kanban">
        {statusOptions.map((status) => {
          const list = companiesWithMeta.filter((company) => company.status === status);

          return (
            <div key={status} className="kanban-col">
              <div className="kanban-head">
                <span className={`badge ${getStatusBadgeClass(status)}`}>
                  {status}
                </span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  {list.length}件
                </span>
              </div>

              <div className="kanban-list">
                {list.length === 0 ? (
                  <div className="empty">企業なし</div>
                ) : (
                  list.map((company) => (
                    <button
                      key={company.id}
                      className="kanban-card"
                      onClick={() => handleEdit(company)}
                    >
                      <div className="kanban-title">{company.companyName}</div>
                      <div className="kanban-sub">{company.internshipTitle}</div>

                      <div className="kanban-foot">
                        <span className={`badge ${deadlineBadgeClass(company.daysLeft)}`}>
                          {deadlineText(company.daysLeft)}
                        </span>
                        <span className="badge badge-neutral">
                          {company.score}点
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}