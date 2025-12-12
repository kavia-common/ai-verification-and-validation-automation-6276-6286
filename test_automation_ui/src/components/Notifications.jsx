import React from 'react';

export default function Notifications({ message, type = 'info', onClose }) {
  if (!message) return null;
  const bg = type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--success)' : 'var(--secondary)';
  return (
    <div
      role="status"
      aria-live="polite"
      className="card"
      style={{ background: bg, color: '#fff', borderColor: 'transparent' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
        <div>{message}</div>
        <button className="btn ghost" onClick={onClose} aria-label="Close notification">Close</button>
      </div>
    </div>
  );
}
