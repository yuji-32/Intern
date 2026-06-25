import Field from "../components/Field";
import { useState } from "react";

export default function CompanyFormPage({
  editingId,
  form,
  handleFormChange,
  handleSubmit,
  resetForm,
  statusOptions,
  siteOptions,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <section className="panel">
      <div className="panel-head">
        <div className="panel-title">{editingId ? "企業を編集" : "企業を追加"}</div>
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
              <div className="site-autocomplete">
                <input
                  className="field"
                  value={form.siteName}
                  onChange={(e) => handleFormChange("siteName", e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="マイナビ / OfferBox など"
                />

                {showSuggestions && siteOptions.length > 0 && (
                  <div className="site-suggestions">
                    {siteOptions
                      .filter((site) =>
                        site.toLowerCase().includes(form.siteName.toLowerCase())
                      )
                      .map((site) => (
                        <div
                          key={site}
                          className="site-option"
                          onClick={() => handleFormChange("siteName", site)}
                        >
                          {site}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Field>

            <Field label="締切日">
              <input
                className="field"
                type="date"
                value={form.deadline}
                onChange={(e) => handleFormChange("deadline", e.target.value)}
              />
            </Field>

            <Field label="インターン開始日">
              <input
                className="field"
                type="date"
                value={form.internshipStart}
                onChange={(e) => handleFormChange("internshipStart", e.target.value)}
              />
            </Field>

            <Field label="インターン終了日">
              <input
                className="field"
                type="date"
                value={form.internshipEnd}
                onChange={(e) => handleFormChange("internshipEnd", e.target.value)}
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

            <Field label="志望度">
              <select
                className="select"
                value={form.priority}
                onChange={(e) => handleFormChange("priority", Number(e.target.value))}
              >
                <option value={5}>★★★★★ 第一志望</option>
                <option value={4}>★★★★☆ かなり行きたい</option>
                <option value={3}>★★★☆☆ 普通</option>
                <option value={2}>★★☆☆☆ 少し気になる</option>
                <option value={1}>★☆☆☆☆ とりあえず</option>
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