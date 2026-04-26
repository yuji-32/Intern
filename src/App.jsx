import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import DashboardPage from "./pages/DashboardPage";
import CompaniesPage from "./pages/CompaniesPage";
import KanbanPage from "./pages/KanbanPage";
import SchedulePage from "./pages/SchedulePage";
import CompanyFormPage from "./pages/CompanyFormPage";
import SettingsPage from "./pages/SettingsPage";

const STATUS_OPTIONS = ["気になる", "応募予定", "応募済み", "面接予定", "合格", "不合格"];
const EVENT_TYPES = ["ES締切", "面接", "説明会", "テスト"];

const DEFAULT_WEIGHTS = {
  salary: 3,
  companySize: 2,
  location: 1,
  workStyle: 1,
  interest: 1,
  motivation: 2,
};

const EMPTY_FORM = {
  companyName: "",
  internshipTitle: "",
  url: "",
  siteName: "",
  deadline: "",
  status: "気になる",
  locationText: "",
  paid: false,
  memo: "",
  ratings: {
    salary: 3,
    companySize: 3,
    location: 3,
    workStyle: 3,
    interest: 3,
    motivation: 3,
  },
};

const EMPTY_EVENT_FORM = {
  companyId: "",
  type: "",
  date: "",
  time: "",
  memo: "",
};

const SAMPLE_COMPANIES = [
  {
    id: "sample-rakuten",
    companyName: "楽天グループ",
    internshipTitle: "エンジニアインターン",
    url: "",
    siteName: "OpenWork",
    deadline: "2026-05-10",
    status: "応募予定",
    locationText: "東京",
    paid: true,
    memo: "大手寄り。Web系。年収も高そう。",
    ratings: {
      salary: 5,
      companySize: 5,
      location: 4,
      workStyle: 3,
      interest: 3,
      motivation: 4,
    },
  },
  {
    id: "sample-nttdata",
    companyName: "NTTデータ",
    internshipTitle: "SE体験インターン",
    url: "",
    siteName: "マイナビ",
    deadline: "2026-05-25",
    status: "気になる",
    locationText: "東京",
    paid: false,
    memo: "安定感がある。大手。",
    ratings: {
      salary: 4,
      companySize: 5,
      location: 4,
      workStyle: 4,
      interest: 3,
      motivation: 4,
    },
  },
];

const SAMPLE_EVENTS = [
  {
    id: "event-1",
    companyId: "sample-rakuten",
    type: "ES締切",
    date: "2026-05-08",
    time: "23:59",
    memo: "OpenWork経由で提出",
  },
  {
    id: "event-2",
    companyId: "sample-nttdata",
    type: "説明会",
    date: "2026-05-12",
    time: "14:00",
    memo: "オンライン参加",
  },
];

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function calculateScore(ratings, weights) {
  return Object.keys(ratings).reduce((sum, key) => {
    return sum + ratings[key] * weights[key];
  }, 0);
}

function formatDate(dateString) {
  if (!dateString) return "未設定";
  return new Date(dateString).toLocaleDateString("ja-JP");
}

function daysUntil(deadline) {
  if (!deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(deadline);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function deadlineBadgeClass(daysLeft) {
  if (daysLeft === null) return "badge-neutral";
  if (daysLeft <= 0) return "badge-red";
  if (daysLeft <= 3) return "badge-amber";
  if (daysLeft <= 7) return "badge-blue";
  return "badge-neutral";
}

function deadlineText(daysLeft) {
  if (daysLeft === null) return "締切未設定";
  if (daysLeft < 0) return `締切超過 ${Math.abs(daysLeft)}日`;
  if (daysLeft === 0) return "今日締切";
  return `締切まで ${daysLeft}日`;
}

function getStatusBadgeClass(status) {
  const map = {
    気になる: "badge-neutral",
    応募予定: "badge-blue",
    応募済み: "badge-violet",
    面接予定: "badge-amber",
    合格: "badge-green",
    不合格: "badge-red",
  };
  return map[status] || "badge-neutral";
}

function sortEvents(list) {
  return [...list].sort((a, b) => {
    return new Date(`${a.date}T${a.time || "23:59"}`) - new Date(`${b.date}T${b.time || "23:59"}`);
  });
}

export default function App() {
  const fileInputRef = useRef(null);

  const [page, setPage] = useState("dashboard");
  const [companies, setCompanies] = useState(() =>
    loadFromStorage("intern_companies", SAMPLE_COMPANIES)
  );
  const [events, setEvents] = useState(() =>
    loadFromStorage("intern_events", SAMPLE_EVENTS)
  );
  const [weights, setWeights] = useState(() =>
    loadFromStorage("intern_weights", DEFAULT_WEIGHTS)
  );

  const [form, setForm] = useState(EMPTY_FORM);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [editingId, setEditingId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("すべて");
  const [sortType, setSortType] = useState("deadline");

  useEffect(() => {
    saveToStorage("intern_companies", companies);
  }, [companies]);

  useEffect(() => {
    saveToStorage("intern_events", events);
  }, [events]);

  useEffect(() => {
    saveToStorage("intern_weights", weights);
  }, [weights]);

  const companiesWithMeta = useMemo(() => {
    return companies.map((company) => ({
      ...company,
      score: calculateScore(company.ratings, weights),
      daysLeft: daysUntil(company.deadline),
      relatedEvents: events.filter((event) => event.companyId === company.id),
    }));
  }, [companies, weights, events]);

  const siteOptions = useMemo(() => {
    const sites = companies
    .map((company) => company.siteName)
    .filter((site) => site && site.trim() !== "");
    
    return [...new Set(sites)];
  }, [companies]);

  const eventListWithCompany = useMemo(() => {
    return sortEvents(events).map((event) => {
      const company = companies.find((c) => c.id === event.companyId);
      return {
        ...event,
        companyName: company?.companyName || "企業名なし",
      };
    });
  }, [events, companies]);

  const filteredCompanies = useMemo(() => {
    const filtered = companiesWithMeta.filter((company) => {
      const text = [
        company.companyName,
        company.internshipTitle,
        company.memo,
        company.siteName,
      ]
        .join(" ")
        .toLowerCase();

      const matchText = text.includes(searchText.toLowerCase());
      const matchStatus = statusFilter === "すべて" || company.status === statusFilter;

      return matchText && matchStatus;
    });

    filtered.sort((a, b) => {
      if (sortType === "score") return b.score - a.score;
      if (sortType === "company") {
        return a.companyName.localeCompare(b.companyName, "ja");
      }
      return (
        (a.deadline ? new Date(a.deadline).getTime() : Infinity) -
        (b.deadline ? new Date(b.deadline).getTime() : Infinity)
      );
    });

    return filtered;
  }, [companiesWithMeta, searchText, statusFilter, sortType]);

  const stats = useMemo(() => {
    const total = companiesWithMeta.length;
    const applied = companiesWithMeta.filter((c) => c.status === "応募済み").length;
    const interview = companiesWithMeta.filter((c) => c.status === "面接予定").length;
    const passed = companiesWithMeta.filter((c) => c.status === "合格").length;
    const average = total
      ? Math.round(companiesWithMeta.reduce((sum, c) => sum + c.score, 0) / total)
      : 0;

    const urgentThree = [...companiesWithMeta]
      .filter((c) => c.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);

    const upcomingEvents = eventListWithCompany.slice(0, 4);

    return {
      total,
      applied,
      interview,
      passed,
      average,
      urgentThree,
      upcomingEvents,
    };
  }, [companiesWithMeta, eventListWithCompany]);

  function handleFormChange(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleRatingChange(key, value) {
    setForm((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [key]: Number(value),
      },
    }));
  }

  function handleWeightChange(key, value) {
    setWeights((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function resetEventForm() {
    setEventForm(EMPTY_EVENT_FORM);
  }

  function startCreate() {
    resetForm();
    setPage("form");
  }

  function startCreateEvent(company) {
    setEventForm({
      companyId: company.id,
      type: "",
      date: "",
      time: "",
      memo: "",
    });
    setPage("schedule");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEdit(company) {
    setEditingId(company.id);
    setForm({
      companyName: company.companyName,
      internshipTitle: company.internshipTitle,
      url: company.url,
      siteName: company.siteName,
      deadline: company.deadline,
      status: company.status,
      locationText: company.locationText,
      paid: company.paid,
      memo: company.memo,
      ratings: { ...company.ratings },
    });
    setPage("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    if (!window.confirm("この企業データを削除しますか？")) return;

    setCompanies((prev) => prev.filter((c) => c.id !== id));
    setEvents((prev) => prev.filter((event) => event.companyId !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.companyName.trim() || !form.internshipTitle.trim()) {
      alert("会社名とインターン名は必須です。");
      return;
    }

    const payload = {
      ...form,
      id: editingId ?? crypto.randomUUID(),
    };

    setCompanies((prev) => {
      if (editingId) {
        return prev.map((c) => (c.id === editingId ? payload : c));
      }
      return [payload, ...prev];
    });

    resetForm();
    setPage("companies");
  }

  function handleAddEvent(e) {
    e.preventDefault();

    if (!eventForm.companyId || !eventForm.type.trim() || !eventForm.date) {
      alert("企業・予定内容・日付は必須です。");
      return;
    }

    if (eventForm.type === "その他" && !eventForm.customType.trim()) {
      alert("その他の場合は予定内容を入力してください。");
      return;
    }

    const newEvent = {
      ...eventForm,
      id: crypto.randomUUID(),
    };

    setEvents((prev) => sortEvents([...prev, newEvent]));
    resetEventForm();
  }

  function handleDeleteEvent(id) {
    if (!window.confirm("この予定を削除しますか？")) return;
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }

  function resetAllData() {
    if (!window.confirm("データを初期化しますか？")) return;

    setCompanies(SAMPLE_COMPANIES);
    setEvents(SAMPLE_EVENTS);
    setWeights(DEFAULT_WEIGHTS);
    resetForm();
    resetEventForm();
    setPage("dashboard");
  }

  function exportData() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            companies,
            events,
            weights,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "intern-tracker-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result);

        if (Array.isArray(parsed.companies)) setCompanies(parsed.companies);
        if (Array.isArray(parsed.events)) setEvents(parsed.events);
        if (parsed.weights && typeof parsed.weights === "object") {
          setWeights(parsed.weights);
        }

        alert("データを読み込みました。");
      } catch {
        alert("JSONの読み込みに失敗しました。");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className="app-shell">
      <div className="app-inner">
        <header className="hero hero-simple">
          <div className="hero-kicker">Intern Portfolio App</div>
          <h1 className="hero-title">インターンを探す、比べる、管理する</h1>
          <p className="hero-desc">
            企業情報と選考予定をひも付けて、まとめて管理できるようにした。
          </p>
        </header>

        <div className="layout">
          <aside className="sidebar">
            <div className="sidebar-label">Navigation</div>

            <div className="nav-list">
              <button
                className={`nav-btn ${page === "dashboard" ? "active" : ""}`}
                onClick={() => setPage("dashboard")}
              >
                ダッシュボード
              </button>

              <button
                className={`nav-btn ${page === "companies" ? "active" : ""}`}
                onClick={() => setPage("companies")}
              >
                企業一覧
              </button>

              <button
                className={`nav-btn ${page === "kanban" ? "active" : ""}`}
                onClick={() => setPage("kanban")}
              >
                選考ボード
              </button>

              <button
                className={`nav-btn ${page === "schedule" ? "active" : ""}`}
                onClick={() => setPage("schedule")}
              >
                予定管理
              </button>

              <button
                className={`nav-btn ${page === "form" ? "active" : ""}`}
                onClick={startCreate}
              >
                企業追加 / 編集
              </button>

              <button
                className={`nav-btn ${page === "settings" ? "active" : ""}`}
                onClick={() => setPage("settings")}
              >
                設定
              </button>
            </div>
          </aside>

          <main>
            {page === "dashboard" && (
              <DashboardPage
                stats={stats}
                formatDate={formatDate}
                deadlineBadgeClass={deadlineBadgeClass}
                deadlineText={deadlineText}
              />
            )}

            {page === "companies" && (
              <CompaniesPage
                filteredCompanies={filteredCompanies}
                searchText={searchText}
                setSearchText={setSearchText}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortType={sortType}
                setSortType={setSortType}
                statusOptions={STATUS_OPTIONS}
                startCreate={startCreate}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                startCreateEvent={startCreateEvent}
                deadlineBadgeClass={deadlineBadgeClass}
                deadlineText={deadlineText}
                formatDate={formatDate}
                getStatusBadgeClass={getStatusBadgeClass}
              />
            )}

            {page === "kanban" && (
              <KanbanPage
                companiesWithMeta={companiesWithMeta}
                statusOptions={STATUS_OPTIONS}
                handleEdit={handleEdit}
                deadlineBadgeClass={deadlineBadgeClass}
                deadlineText={deadlineText}
                getStatusBadgeClass={getStatusBadgeClass}
              />
            )}

            {page === "schedule" && (
              <SchedulePage
                events={eventListWithCompany}
                companies={companies}
                eventForm={eventForm}
                setEventForm={setEventForm}
                eventTypes={EVENT_TYPES}
                handleAddEvent={handleAddEvent}
                handleDeleteEvent={handleDeleteEvent}
                resetEventForm={resetEventForm}
              />
            )}

            {page === "form" && (
              <CompanyFormPage
                editingId={editingId}
                form={form}
                handleFormChange={handleFormChange}
                handleRatingChange={handleRatingChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                statusOptions={STATUS_OPTIONS}
                weights={weights}
                calculateScore={calculateScore}
                siteOptions={siteOptions}
              />
            )}

            {page === "settings" && (
              <SettingsPage
                weights={weights}
                handleWeightChange={handleWeightChange}
                setWeights={setWeights}
                defaultWeights={DEFAULT_WEIGHTS}
                onExport={exportData}
                onReset={resetAllData}
                onOpenImport={() => fileInputRef.current?.click()}
              />
            )}
          </main>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={importData}
        />
      </div>
    </div>
  );
}