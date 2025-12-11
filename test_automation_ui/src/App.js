import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';

import Sidebar from './components/Sidebar';
import UploadForm from './components/UploadForm';
import ActionsPanel from './components/ActionsPanel';
import ResultsTable from './components/ResultsTable';
import ReportModal from './components/ReportModal';

import {
  uploadSRS,
  triggerGenerateCases,
  triggerGenerateScripts,
  triggerExecuteTests,
  getRuns,
  getReport,
  downloadArtifact,
  getReportHtmlUrl
} from './api/client';

// PUBLIC_INTERFACE
function App() {
  /** Main UI composition with sidebar and dashboard. */
  const [jobId, setJobId] = useState('');
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState({
    uploading: false,
    generatingCases: false,
    generatingScripts: false,
    executing: false,
    refreshing: false
  });
  const [toast, setToast] = useState('');
  const [selectedRunId, setSelectedRunId] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [lastExecSummary, setLastExecSummary] = useState(null);

  const disabledStates = useMemo(() => ({
    uploading: loading.uploading,
    generatingCases: loading.generatingCases,
    generatingScripts: loading.generatingScripts,
    executing: loading.executing,
    hasJobId: !!jobId
  }), [loading, jobId]);

  useEffect(() => {
    // Initial fetch
    refreshRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers
  const withToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // API handlers
  const handleUpload = async (file) => {
    setLoading((s) => ({ ...s, uploading: true }));
    try {
      const res = await uploadSRS(file);
      setJobId(res.jobId);
      withToast(`Uploaded. jobId=${res.jobId}`);
    } catch (e) {
      withToast(e?.message || 'Upload failed');
      throw e;
    } finally {
      setLoading((s) => ({ ...s, uploading: false }));
    }
  };

  const handleGenerateCases = async () => {
    if (!jobId) return;
    setLoading((s) => ({ ...s, generatingCases: true }));
    try {
      const res = await triggerGenerateCases(jobId);
      withToast(`Cases generated: ${res.count}`);
    } catch (e) {
      withToast(e?.message || 'Failed to generate cases');
    } finally {
      setLoading((s) => ({ ...s, generatingCases: false }));
    }
  };

  const handleGenerateScripts = async () => {
    if (!jobId) return;
    setLoading((s) => ({ ...s, generatingScripts: true }));
    try {
      const res = await triggerGenerateScripts(jobId);
      withToast(`Scripts generated: ${res.files?.length ?? 0}`);
    } catch (e) {
      withToast(e?.message || 'Failed to generate scripts');
    } finally {
      setLoading((s) => ({ ...s, generatingScripts: false }));
    }
  };

  const handleExecute = async () => {
    if (!jobId) return;
    setLoading((s) => ({ ...s, executing: true }));
    try {
      const res = await triggerExecuteTests(jobId);
      setLastExecSummary(res);
      withToast(`Execution: ${res.status}`);
      // Refresh runs after execution
      await refreshRuns();
    } catch (e) {
      withToast(e?.message || 'Execution failed');
    } finally {
      setLoading((s) => ({ ...s, executing: false }));
    }
  };

  const refreshRuns = async () => {
    setLoading((s) => ({ ...s, refreshing: true }));
    try {
      const list = await getRuns();
      setRuns(Array.isArray(list) ? list : []);
    } catch (e) {
      withToast(e?.message || 'Failed to fetch runs');
    } finally {
      setLoading((s) => ({ ...s, refreshing: false }));
    }
  };

  const handleViewReport = async (runId) => {
    setSelectedRunId(runId);
    setSelectedReport(null);
    try {
      const report = await getReport(runId);
      setSelectedReport(report);
    } catch (e) {
      // If JSON report not available, allow HTML to be opened from modal
      setSelectedReport(null);
    }
  };

  const handleCloseReport = () => {
    setSelectedRunId('');
    setSelectedReport(null);
  };

  const handleDownloadArtifacts = async (runId) => {
    try {
      // Download stdout & stderr by default; junit.xml maybe optional.
      const names = ['stdout.txt', 'stderr.txt', 'junit.xml'];
      for (const name of names) {
        try {
          const { blob, filename } = await downloadArtifact(runId, name);
          const href = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = href;
          a.download = `${runId}-${filename}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(href);
        } catch (_ignored) {
          // ignore missing artifact
        }
      }
      withToast(`Artifacts downloaded for ${runId} (where available)`);
    } catch (e) {
      withToast(e?.message || 'Failed to download artifacts');
    }
  };

  // UI
  return (
    <div className="app-shell">
      <Sidebar
        onUploadClick={() => {
          const el = document.getElementById('upload-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onGenerateCases={handleGenerateCases}
        onGenerateScripts={handleGenerateScripts}
        onExecuteTests={handleExecute}
        onRefreshResults={refreshRuns}
        disabledStates={disabledStates}
        currentJobId={jobId}
      />
      <main className="main">
        <div className="container">
          <div>
            <div className="page-title">Verification & Validation</div>
            <div className="page-subtitle">Navy Blue Theme • Upload, Generate and Execute</div>

            <section id="upload-section" className="section">
              <UploadForm
                onUpload={handleUpload}
                uploading={loading.uploading}
                jobId={jobId}
              />
            </section>

            <section className="section">
              <ActionsPanel
                jobId={jobId}
                onGenerateCases={handleGenerateCases}
                onGenerateScripts={handleGenerateScripts}
                onExecute={handleExecute}
                loadingStates={{
                  generatingCases: loading.generatingCases,
                  generatingScripts: loading.generatingScripts,
                  executing: loading.executing,
                }}
                lastResult={lastExecSummary}
              />
            </section>
          </div>

          <div>
            <ResultsTable
              runs={runs}
              onRefresh={refreshRuns}
              onViewReport={handleViewReport}
              onDownloadArtifacts={handleDownloadArtifacts}
            />
            <div className="small" style={{marginTop: 10}}>
              Tip: After Execute Tests, click Refresh if the list didn’t update.
            </div>
          </div>
        </div>

        {toast && (
          <div style={{
            position: 'fixed', right: 16, bottom: 16, background: 'var(--surface)',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: '10px 12px',
            borderRadius: 8
          }} role="status" aria-live="polite">
            {toast}
          </div>
        )}
      </main>

      {selectedRunId && (
        <ReportModal
          runId={selectedRunId}
          report={selectedReport}
          onClose={handleCloseReport}
        />
      )}
    </div>
  );
}

export default App;
