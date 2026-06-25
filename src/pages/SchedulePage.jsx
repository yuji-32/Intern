import Field from "../components/Field";
import { useMemo, useState } from "react";

const INTERNSHIP_COLORS = [
  "blue",
  "green",
  "purple",
  "orange",
  "pink",
  "cyan",
];

function sortEvents(list) {
  return [...list].sort((a, b) => {
    return (
      new Date(`${a.date}T${a.time || "23:59"}`) -
      new Date(`${b.date}T${b.time || "23:59"}`)
    );
  });
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function createCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < first.getDay(); i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

function isDateInRange(dateKey, start, end) {
  if (!start || !end) return false;
  return start <= dateKey && dateKey <= end;
}

function getCompanyColor(index) {
  return INTERNSHIP_COLORS[index % INTERNSHIP_COLORS.length];
}

export default function SchedulePage({
  events,
  companies,
  companiesWithMeta = [],
  eventForm,
  setEventForm,
  eventTypes,
  handleAddEvent,
  handleDeleteEvent,
  resetEventForm,
}) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const calendarDays = useMemo(() => {
    return createCalendarDays(year, month);
  }, [year, month]);

  const sortedEvents = useMemo(() => sortEvents(events), [events]);

  const internshipRows = useMemo(() => {
    return companiesWithMeta
      .filter((company) => company.internshipStart && company.internshipEnd)
      .sort((a, b) => {
        return new Date(a.internshipStart) - new Date(b.internshipStart);
      })
      .map((company, index) => ({
        ...company,
        color: getCompanyColor(index),
        rowIndex: index,
      }));
  }, [companiesWithMeta]);

  function moveMonth(diff) {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + diff, 1)
    );
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <div className="panel-title">予定管理</div>
        <div className="panel-subtitle">
          面接・説明会・ES締切・インターン期間をまとめて確認できます。
        </div>
      </div>

      <div className="calendar-box">
        <div className="calendar-header">
          <button className="btn" type="button" onClick={() => moveMonth(-1)}>
            前月
          </button>

          <div className="calendar-title">
            {year}年 {month + 1}月
          </div>

          <button className="btn" type="button" onClick={() => moveMonth(1)}>
            次月
          </button>
        </div>

        <div className="calendar-week">
          <div>日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div>土</div>
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const dateKey = day ? toDateKey(day) : "";

            const dayEvents = day
              ? sortedEvents.filter((event) => event.date === dateKey)
              : [];

            const dayInternships = day
              ? internshipRows.filter((company) =>
                  isDateInRange(
                    dateKey,
                    company.internshipStart,
                    company.internshipEnd
                  )
                )
              : [];

            return (
              <div
                key={index}
                className={`calendar-cell ${
                  day && dateKey === toDateKey(today) ? "today" : ""
                }`}
              >
                {day && <div className="calendar-date">{day.getDate()}</div>}

                {day && (
                  <div className="calendar-events">
                    <div className="internship-layer">
                      {dayInternships.map((company) => {
                        const isStart = company.internshipStart === dateKey;
                        const isEnd = company.internshipEnd === dateKey;

                        return (
                          <div
                            key={company.id}
                            className={`calendar-internship ${company.color} ${
                              isStart ? "start" : ""
                            } ${isEnd ? "end" : ""}`}
                            style={{ top: company.rowIndex * 26 }}
                            title={`${company.companyName} ${company.internshipStart}〜${company.internshipEnd}`}
                          >
                            {isStart ? `▶ ${company.companyName}` : ""}
                          </div>
                        );
                      })}
                    </div>

                    <div className="single-event-layer">
                      {dayEvents.map((event) => (
                        <div key={event.id} className="calendar-event single">
                          {event.time ? `${event.time} ` : ""}
                          {event.type}：{event.companyName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="schedule-grid">
        <form className="schedule-form" onSubmit={handleAddEvent}>
          <div className="section-title">予定を追加</div>

          <div className="form-grid">
            <Field label="企業">
              <select
                className="select"
                value={eventForm.companyId}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    companyId: e.target.value,
                  }))
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

            <Field label="予定内容">
              <select
                className="select"
                value={
                  eventTypes.includes(eventForm.type) ? eventForm.type : "custom"
                }
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    type: e.target.value === "custom" ? "" : e.target.value,
                  }))
                }
              >
                <option value="">予定内容を選択</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                <option value="custom">直接入力する</option>
              </select>
            </Field>

            {!eventTypes.includes(eventForm.type) && (
              <Field label="予定内容を入力">
                <input
                  className="field"
                  value={eventForm.type}
                  onChange={(e) =>
                    setEventForm((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  placeholder="OB訪問 / 座談会 / 書類提出 など"
                />
              </Field>
            )}

            <Field label="日付">
              <input
                className="field"
                type="date"
                value={eventForm.date}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="時間">
              <input
                className="field"
                type="time"
                value={eventForm.time}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
              />
            </Field>

            <Field label="メモ">
              <textarea
                className="textarea"
                value={eventForm.memo}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    memo: e.target.value,
                  }))
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

        <div className="section">
          <div className="section-title">予定一覧</div>

          <div className="schedule-list">
            {sortedEvents.length === 0 ? (
              <div className="empty">予定はまだありません。</div>
            ) : (
              sortedEvents.map((event) => (
                <div key={event.id} className="schedule-card">
                  <div style={{ width: "100%" }}>
                    <div className="schedule-top">
                      <div>
                        <div className="schedule-title">{event.type}</div>
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
                        type="button"
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