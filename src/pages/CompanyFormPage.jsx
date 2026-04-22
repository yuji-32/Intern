import Field from "../components/Field";
import RatingSelect from "../components/RatingSelect";

export default function CompanyFormPage({
  editingId,
  form,
  handleFormChange,
  handleRatingChange,
  handleSubmit,
  resetForm,
  statusOptions,
  weights,
  calculateScore,
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div className="panel-title">{editingId ? "企業を編集" : "企業を追加"}</div>
        <div className="panel-subtitle">
          このページでは登録に必要な情報だけを順番に入力する。
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="section">
          <div className="section-title">基本情報</div>

          <div className="form-grid">
            <Field label="会社名">
              <input
                className="field"
                value={form.companyName}
                onChange={(e) => handleFormChange("companyName", e.target.value)}
                required
              />
            </Field>

            <Field label="インターン名">
              <input
                className="field"
                value={form.internshipTitle}
                onChange={(e) => handleFormChange("internshipTitle", e.target.value)}
                required
              />
            </Field>

            <Field label="募集URL">
              <input
                className="field"
                value={form.url}
                onChange={(e) => handleFormChange("url", e.target.value)}
                placeholder="https://..."
              />
            </Field>

            <Field label="応募サイト名">
              <input
                className="field"
                value={form.siteName}
                onChange={(e) => handleFormChange("siteName", e.target.value)}
                placeholder="マイナビ / OfferBox など"
              />
            </Field>

            <Field label="締切日">
              <input
                className="field"
                type="date"
                value={form.deadline}
                onChange={(e) => handleFormChange("deadline", e.target.value)}
              />
            </Field>

            <Field label="勤務地">
              <input
                className="field"
                value={form.locationText}
                onChange={(e) => handleFormChange("locationText", e.target.value)}
                placeholder="東京 / 大阪 など"
              />
            </Field>
          </div>
        </div>

        <div className="section">
          <div className="section-title">選考情報</div>

          <div className="form-grid">
            <Field label="ステータス">
              <select
                className="select"
                value={form.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="報酬">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.paid}
                  onChange={(e) => handleFormChange("paid", e.target.checked)}
                />
                報酬あり
              </label>
            </Field>
          </div>

          <div style={{ marginTop: 14 }}>
            <label className="label">メモ</label>
            <textarea
              className="textarea"
              rows={4}
              value={form.memo}
              onChange={(e) => handleFormChange("memo", e.target.value)}
              placeholder="志望理由や面接メモなど"
            />
          </div>
        </div>

        <div className="section">
          <div className="section-title">志望度評価</div>
          <div className="panel-subtitle" style={{ marginBottom: 14 }}>
            重み設定を反映したスコアが自動で計算される。
          </div>

          <div style={{ marginBottom: 16 }}>
            <span className="badge badge-neutral">
              現在の志望度 {calculateScore(form.ratings, weights)}点
            </span>
          </div>

          <div className="form-grid">
            <RatingSelect
              label="年収期待"
              value={form.ratings.salary}
              onChange={(v) => handleRatingChange("salary", v)}
            />
            <RatingSelect
              label="大手度"
              value={form.ratings.companySize}
              onChange={(v) => handleRatingChange("companySize", v)}
            />
            <RatingSelect
              label="勤務地の良さ"
              value={form.ratings.location}
              onChange={(v) => handleRatingChange("location", v)}
            />
            <RatingSelect
              label="働き方の良さ"
              value={form.ratings.workStyle}
              onChange={(v) => handleRatingChange("workStyle", v)}
            />
            <RatingSelect
              label="業務への興味"
              value={form.ratings.interest}
              onChange={(v) => handleRatingChange("interest", v)}
            />
            <RatingSelect
              label="受かりたさ"
              value={form.ratings.motivation}
              onChange={(v) => handleRatingChange("motivation", v)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            {editingId ? "更新する" : "追加する"}
          </button>

          <button className="btn" type="button" onClick={resetForm}>
            リセット
          </button>
        </div>
      </form>
    </section>
  );
}