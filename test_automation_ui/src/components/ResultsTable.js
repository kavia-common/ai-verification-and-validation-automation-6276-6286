import React from 'react';

// PUBLIC_INTERFACE
export default function ResultsTable({
  runs = [],
  onRefresh,
  onViewReport,
  onDownloadArtifacts
}) {
  /** Table of runs with actions to view report and download artifacts. */

  return (
    <div className="card" aria-labelledby="results-title">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div className="card-title" id="results-title">Results</div>
          <div className="card-subtitle">Recent executions and their outcomes.</div>
        </div>
        <div>
          <button className="btn btn-outline" onClick={onRefresh}>Refresh</button>
        </div>
      </div>

      <div className="table-wrap section" role="region" aria-label="Runs results table">
        <table className="table">
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Job ID</th>
              <th>Total</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Duration</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 && (
              <tr><td colSpan="9" className="small">No runs yet.</td></tr>
            )}
            {runs.map((r) => (
              <tr key={r.runId}>
                <td><span className="kbd">{r.runId}</span></td>
                <td><span className="kbd">{r.jobId}</span></td>
                <td>{r?.totals?.total ?? '—'}</td>
                <td>{r?.totals?.passed ?? '—'}</td>
                <td>{r?.totals?.failed ?? '—'}</td>
                <td>{typeof r.duration === 'number' ? `${r.duration.toFixed(2)}s` : '—'}</td>
                <td>{r.timestamp ?? '—'}</td>
                <td>
                  <span className={`badge ${r.status === 'passed' ? 'success' : (r.status === 'failed' ? 'error' : '')}`}>
                    {r.status ?? '—'}
                  </span>
                </td>
                <td>
                  <div style={{display: 'flex', gap: 8}}>
                    <button className="btn btn-outline" onClick={() => onViewReport(r.runId)}>
                      View Report
                    </button>
                    <button className="btn btn-outline" onClick={() => onDownloadArtifacts(r.runId)}>
                      Download Artifacts
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
