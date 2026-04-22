import Field from "../components/Field";

function sortEvents(list) {
  return [...list].sort((a, b) => {
    return new Date(`${a.date}T${a.time || "23:59"}`) - new Date(`${b.date}T${b.time || "23:59"}`);
  });
}

export default function SchedulePage({
  events,
  companies,
  eventForm,
  setEventForm,
  eventTypes,
  handleAddEvent,
  handleDeleteEvent,
  resetEventForm,
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div className="panel-title">予定管理</div>
        <div className="panel-subtitle">
          企業とひも付いた予定を追加して管理する。
        </div>
      </div>

      <div className="schedule-grid">
        <div className="schedule-form">
          <div className="section-title">予定を追加</div>

          <form onSubmit={handleAddEvent}>
            <Field label="企業">
              <select
                className="select"
                value={eventForm.companyId}
                onChange={(e) =>
                  setEventForm((prev) => ({ ...prev, companyId: e.target.value }))
                }
              >
                <option value="">企業を選択</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </Field>

            <div style={{ height: 12 }} />

            <Field label="予定名">
              <input
                className="field"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="一次面接 / ES提出 など"
              />
            </Field>

            <div style={{ height: 12 }} />

            <Field label="種類">
              <select
                className="select"
                value={eventForm.type}
                onChange={(e) =>
                  setEventForm((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>

            <div className="form-grid" style={{ marginTop: 12 }}>
              <Field label="日付">
                <input
                  className="field"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </Field>

              <Field label="時間">
                <input
                  className="field"
                  type="time"
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
              </Field>
            </div>

            <div style={{ marginTop: 12 }}>
              <Field label="メモ">
                <textarea
                  className="textarea"
                  rows={3}
                  value={eventForm.memo}
                  onChange={(e) =>
                    setEventForm((prev) => ({ ...prev, memo: e.target.value }))
                  }
                  placeholder="Zoom URL、持ち物、提出先など"
                />
              </Field>
            </div>

            <div className="form-actions" style={{ marginTop: 14 }}>
              <button className="btn btn-primary" type="submit">
                予定を追加
              </button>
              <button className="btn" type="button" onClick={resetEventForm}>
                リセット
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="section-title" style={{ marginBottom: 12 }}>
            予定一覧
          </div>

          <div className="schedule-list">
            {events.length === 0 ? (
              <div className="empty">予定はまだありません。</div>
            ) : (
              sortEvents(events).map((event) => (
                <div key={event.id} className="schedule-card">
                  <div style={{ width: "100%" }}>
                    <div className="schedule-top">
                      <div>
                        <div className="schedule-title">{event.title}</div>
                        <div className="schedule-meta">{event.companyName}</div>
                      </div>

                      <span className="badge badge-blue">{event.type}</span>
                    </div>

                    <div className="schedule-meta" style={{ marginTop: 10 }}>
                      {event.date}
                      {event.time ? ` ${event.time}` : ""}
                    </div>

                    {event.memo && (
                      <div className="schedule-meta">{event.memo}</div>
                    )}

                    <div className="card-actions" style={{ marginTop: 12 }}>
                      <button
                        className="link-btn"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}