import React from 'react';
import { getReportHtmlUrl } from '../api/client';

// PUBLIC_INTERFACE
export default function ReportModal({ runId, report, onClose }) {
  /** Modal to display prettified JSON or link to HTML report if available. */
  if (!runId) return null;

  const htmlUrl = getReportHtmlUrl(runId);
  const pretty = report ? JSON.stringify(report, null, 2) : 'No report data.';

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <div className="modal">
        <div className="modal-header">
          <div className="page-title" id="report-title">Report for {runId}</div>
          <div style={{display: 'flex', gap: 8}}>
            <a className="btn btn-outline" href={htmlUrl} target="_blank" rel="noreferrer">
              Open HTML (if available)
            </a>
            <button className="btn btn-danger" onClick={onClose} aria-label="Close report modal">Close</button>
          </div>
        </div>
        <div className="modal-body">
          <div className="section">
            <div className="small">JSON</div>
            <pre className="pretty" aria-label="Report JSON">{pretty}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
