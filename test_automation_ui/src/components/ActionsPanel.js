import React from 'react';

// PUBLIC_INTERFACE
export default function ActionsPanel({
  jobId,
  onGenerateCases,
  onGenerateScripts,
  onExecute,
  loadingStates = {},
  lastResult = {},
}) {
  /** Panel to run actions for current job and show quick statuses. */
  const {
    generatingCases = false,
    generatingScripts = false,
    executing = false,
  } = loadingStates;

  const ResultRow = ({ label, value }) => (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0'}}>
      <div className="small">{label}</div>
      <div className="badge">{String(value ?? '—')}</div>
    </div>
  );

  return (
    <div className="card" aria-labelledby="actions-title">
      <div className="card-title" id="actions-title">Actions</div>
      <div className="card-subtitle">Trigger generation and execution for the active job.</div>

      <div className="grid-2 section">
        <button className="btn" disabled={!jobId || generatingCases} onClick={onGenerateCases}>
          {generatingCases ? 'Generating…' : 'Generate Cases'}
        </button>
        <button className="btn" disabled={!jobId || generatingScripts} onClick={onGenerateScripts}>
          {generatingScripts ? 'Generating…' : 'Generate Scripts'}
        </button>
        <button className="btn btn-success" disabled={!jobId || executing} onClick={onExecute}>
          {executing ? 'Executing…' : 'Execute Tests'}
        </button>
      </div>

      <div className="section">
        <div className="small">Job:</div>
        {jobId ? <div className="badge info">{jobId}</div> : <div className="badge">None</div>}
      </div>

      {lastResult?.status && (
        <div className="section">
          <div className="small">Last Execution:</div>
          <ResultRow label="Run ID" value={lastResult.runId} />
          <ResultRow label="Status" value={lastResult.status} />
          <ResultRow label="Passed" value={lastResult?.totals?.passed} />
          <ResultRow label="Failed" value={lastResult?.totals?.failed} />
        </div>
      )}
    </div>
  );
}
