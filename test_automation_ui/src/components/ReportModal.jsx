import React, { useEffect, useRef } from 'react';

export default function ReportModal({ open, data, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Run details"
      tabIndex={-1}
      ref={dialogRef}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
      onKeyDown={(e)=>{ if (e.key === 'Escape') onClose?.(); }}
    >
      <div className="card" style={{ maxWidth: 900, width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0 }}>Run: {data?.id}</h3>
          <button className="btn ghost" onClick={onClose} aria-label="Close report">Close</button>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 10, color: 'var(--muted)' }}>
            Status: {data?.status} • Started: {data?.started_at ? new Date(data.started_at).toLocaleString() : '-'}
          </div>
          {Array.isArray(data?.cases) && data.cases.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Logs</th>
                </tr>
              </thead>
              <tbody>
                {data.cases.map((c, idx) => (
                  <tr key={idx}>
                    <td>{c.name || c.id || `case-${idx+1}`}</td>
                    <td>{c.status}</td>
                    <td>{c.duration ?? '-'}</td>
                    <td>
                      {c.logs ? (
                        <details>
                          <summary>View logs</summary>
                          <pre style={{ whiteSpace: 'pre-wrap' }}>{c.logs}</pre>
                        </details>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: 'var(--muted)' }}>No case details available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
