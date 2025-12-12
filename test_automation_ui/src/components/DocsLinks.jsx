import React from 'react';

export default function DocsLinks() {
  const baseURL = process.env.REACT_APP_API_BASE_URL || '';
  return (
    <div className="card" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Developer Docs</div>
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        <li><a href={`${baseURL}/docs`} target="_blank" rel="noreferrer" style={{ color: '#fff' }}>Swagger UI</a></li>
        <li><a href={`${baseURL}/openapi.json`} target="_blank" rel="noreferrer" style={{ color: '#fff' }}>OpenAPI JSON</a></li>
      </ul>
    </div>
  );
}
