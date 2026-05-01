import CompanyCard from "../components/CompanyCard";

export default function CompaniesPage({
  filteredCompanies,
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  sortType,
  setSortType,
  statusOptions,
  startCreate,
  handleEdit,
  handleDelete,
  startCreateEvent,
  deadlineBadgeClass,
  deadlineText,
  formatDate,
  getStatusBadgeClass,
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div className="panel-title">企業一覧</div>
      </div>

      <div className="tools">
        <input
          className="field"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="会社名・メモ・サイト名で検索"
        />

        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="すべて">すべて</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="deadline">締切順</option>
          <option value="score">志望度順</option>
          <option value="company">会社名順</option>
        </select>

        <button className="btn btn-primary" onClick={startCreate}>
          追加
        </button>
      </div>

      <div className="company-grid">
        {filteredCompanies.length === 0 ? (
          <div className="empty">条件に合う企業がありません。</div>
        ) : (
          filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={() => handleEdit(company)}
              onDelete={() => handleDelete(company.id)}
              onAddEvent={() => startCreateEvent(company)}
              deadlineBadgeClass={deadlineBadgeClass}
              deadlineText={deadlineText}
              formatDate={formatDate}
              getStatusBadgeClass={getStatusBadgeClass}
            />
          ))
        )}
      </div>
    </section>
  );
}