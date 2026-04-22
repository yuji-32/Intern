import WeightCard from "../components/WeightCard";

export default function SettingsPage({
  weights,
  handleWeightChange,
  setWeights,
  defaultWeights,
  onExport,
  onReset,
  onOpenImport,
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div className="panel-title">設定</div>
        <div className="panel-subtitle">
          志望度の重みやデータ管理をここでまとめて行う。
        </div>
      </div>

      <div className="section">
        <div className="section-title">志望度の重み</div>

        <div className="weight-grid">
          <WeightCard
            label="年収期待"
            value={weights.salary}
            onChange={(v) => handleWeightChange("salary", v)}
          />
          <WeightCard
            label="大手度"
            value={weights.companySize}
            onChange={(v) => handleWeightChange("companySize", v)}
          />
          <WeightCard
            label="勤務地"
            value={weights.location}
            onChange={(v) => handleWeightChange("location", v)}
          />
          <WeightCard
            label="働き方"
            value={weights.workStyle}
            onChange={(v) => handleWeightChange("workStyle", v)}
          />
          <WeightCard
            label="業務への興味"
            value={weights.interest}
            onChange={(v) => handleWeightChange("interest", v)}
          />
          <WeightCard
            label="受かりたさ"
            value={weights.motivation}
            onChange={(v) => handleWeightChange("motivation", v)}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn" onClick={() => setWeights(defaultWeights)}>
            デフォルトに戻す
          </button>
        </div>
      </div>

      <div className="section">
        <div className="section-title">データ管理</div>
        <div className="panel-subtitle" style={{ marginBottom: 16 }}>
          必要なときだけ使う機能はここにまとめる。
        </div>

        <div className="settings-actions">
          <button className="btn btn-soft" onClick={onExport}>
            データを書き出す
          </button>
          <button className="btn btn-soft" onClick={onOpenImport}>
            データを読み込む
          </button>
          <button className="btn btn-danger" onClick={onReset}>
            すべて初期化
          </button>
        </div>
      </div>
    </section>
  );
}