import React from 'react';

export default function ResultsTable({ items = [], onOpen }) {
  return (
    <table className="table" role="table" aria-label="Results">
      <thead>
        <tr>
          <th>Run ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Started</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)' }}>No results</td></tr>
        ) : items.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.name || '-'}</td>
            <td>
              <span className={`status-pill ${r.status === 'pass' ? 'status-pass' : r.status === 'fail' ? 'status-fail' : 'status-running'}`}>
                {r.status}
              </span>
            </td>
            <td>{r.duration ?? '-'}</td>
            <td>{r.started_at ? new Date(r.started_at).toLocaleString() : '-'}</td>
            <td>
              <button className="btn ghost" onClick={()=>onOpen?.(r)}>Open</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
