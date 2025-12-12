import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { usePolling } from '../hooks/usePolling';
import Notifications from '../components/Notifications';

export default function GenerationPanel() {
  const { triggerGenerateCases, triggerGenerateScripts, getJobStatus } = useApi();
  const [srsId, setSrsId] = useState('');
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const startCases = async () => {
    setErrorMsg(null);
    if (!srsId) { setErrorMsg('Please enter a valid SRS ID.'); return; }
    try {
      const data = await triggerGenerateCases(srsId);
      setJob({ kind: 'cases', job_id: data.job_id });
      setStatus({ state: 'queued' });
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to start test case generation.');
    }
  };

  const startScripts = async () => {
    setErrorMsg(null);
    if (!srsId) { setErrorMsg('Please enter a valid SRS ID.'); return; }
    try {
      const data = await triggerGenerateScripts(srsId);
      setJob({ kind: 'scripts', job_id: data.job_id });
      setStatus({ state: 'queued' });
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to start script generation.');
    }
  };

  usePolling(
    job ? () => getJobStatus(job.job_id) : null,
    {
      enabled: !!job && !['completed', 'failed'].includes(status?.status || status?.state),
      interval: 2000,
      onUpdate: (data) => {
        if (data?.error) {
          setErrorMsg(data.error?.friendlyMessage || 'Error while checking job status.');
          return;
        }
        setStatus(data);
      }
    }
  );

  return (
    <div className="card" aria-labelledby="gen-title">
      <h2 id="gen-title" style={{ marginTop: 0 }}>AI Generation</h2>
      <div className="form-row">
        <label htmlFor="srsId">SRS ID</label>
        <input id="srsId" className="input" value={srsId} onChange={(e)=>setSrsId(e.target.value)} placeholder="Enter SRS ID" />
        <button className="btn secondary" onClick={startCases}>Generate Test Cases</button>
        <button className="btn" onClick={startScripts}>Generate Scripts</button>
      </div>

      {job && (
        <div className="card" style={{ marginTop: 12 }}>
          <strong>Job:</strong> {job.job_id} ({job.kind})
          <div style={{ marginTop: 6 }}>
            Status: <span className="status-pill status-running">{status?.status || status?.state || 'unknown'}</span>
            {status?.progress != null ? <span style={{ marginLeft: 8 }}>Progress: {status.progress}%</span> : null}
            {status?.message ? <div style={{ color: 'var(--muted)' }}>{status.message}</div> : null}
          </div>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <Notifications message={errorMsg} type="error" onClose={() => setErrorMsg(null)} />
      </div>
    </div>
  );
}
