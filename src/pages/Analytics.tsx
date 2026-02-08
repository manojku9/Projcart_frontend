export default function Analytics() {
  return (
    <main className="container page-analytics">
      <div className="analytics-header">
        <div>
          <h2>Project Analytics</h2>
          <p className="analytics-subtitle">Review project views and engagement trends.</p>
        </div>
        <a href="/dashboard" className="btn-secondary analytics-back">Back</a>
      </div>

      <section className="analytics-cards">
        <div className="analytics-card">
          <p className="analytics-card-label">Total views</p>
          <p className="analytics-card-value">0</p>
          <p className="analytics-card-meta">All time</p>
        </div>
        <div className="analytics-card">
          <p className="analytics-card-label">Views this week</p>
          <p className="analytics-card-value">0</p>
          <p className="analytics-card-meta">Last 7 days</p>
        </div>
        <div className="analytics-card">
          <p className="analytics-card-label">Top project</p>
          <p className="analytics-card-value">-</p>
          <p className="analytics-card-meta">Most viewed</p>
        </div>
      </section>

      <section className="analytics-table">
        <div className="analytics-table-header">
          <h3>Project Views</h3>
          <span className="analytics-table-note">Connect tracking to see live numbers.</span>
        </div>
        <div className="analytics-row analytics-row-head">
          <span>Project</span>
          <span>Views</span>
          <span>Trend</span>
        </div>
        <div className="analytics-row">
          <span>-</span>
          <span>0</span>
          <span>--</span>
        </div>
      </section>
    </main>
  );
}
