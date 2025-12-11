import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({
  onUploadClick,
  onGenerateCases,
  onGenerateScripts,
  onExecuteTests,
  onRefreshResults,
  disabledStates = {},
  currentJobId
}) {
  /** Sidebar with action buttons for the V&V workflow. */
  const {
    uploading = false,
    generatingCases = false,
    generatingScripts = false,
    executing = false,
    hasJobId = false
  } = disabledStates;

  return (
    <aside className="sidebar" aria-label="Workflow sidebar">
      <div className="brand">
        <div className="brand-badge" aria-label="Brand badge">AI V&V</div>
        <div>Automation</div>
      </div>
      <div className="small" style={{color: 'rgba(255,255,255,0.85)'}}>
        Streamlined test generation and execution
      </div>

      <div className="sidebar-section-title">Actions</div>
      <div className="sidebar-actions">
        <button className="btn btn-outline" onClick={onUploadClick} disabled={uploading}>
          Upload SRS (.csv)
        </button>
        <button className="btn" onClick={onGenerateCases} disabled={!hasJobId || generatingCases}>
          Generate Cases
        </button>
        <button className="btn" onClick={onGenerateScripts} disabled={!hasJobId || generatingScripts}>
          Generate Scripts
        </button>
        <button className="btn btn-success" onClick={onExecuteTests} disabled={!hasJobId || executing}>
          Execute Tests
        </button>
        <button className="btn btn-outline" onClick={onRefreshResults}>
          Refresh Results
        </button>
      </div>

      <div className="section small" style={{marginTop: 16}}>
        Current job: {currentJobId ? <span className="badge info">{currentJobId}</span> : 'None'}
      </div>
    </aside>
  );
}
