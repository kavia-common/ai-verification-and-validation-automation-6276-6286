import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { usePolling } from '../hooks/usePolling';
import Notifications from '../components/Notifications';

export default function ExecutionPanel() {
  const { triggerExecute, getJobStatus } = useApi();
  const [selection, setSelection] = useState('');
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const startExecution = async () => {
    setErrorMsg(null);
    try {
      const payload = selection ? { selection } : {};
      const data = await triggerExecute(payload);
      setJobId(data.job_id);
      setStatus({ status: 'queued' });
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to start execution.');
    }
  };

  usePolling(
    jobId ? () => getJobStatus(jobId) : null,
    {
      enabled: !!jobId && !['completed', 'failed'].includes(status?.status),
      interval: 2000,
      onUpdate: (data) => {
        if (data?.error) {
          setErrorMsg(data.error?.friendlyMessage || 'Error while checking execution status.');
          return;
        }
        setStatus(data);
      }
    }
  );

  return (
    <div className="card" aria-labelledby="exe-title">
      <h2 id="exe-title" style={{ marginTop: 0 }}>Execute Tests</h2>
      <div className="form-row">
        <label htmlFor="sel">Selection (optional)</label>
        <input id="sel" className="input" placeholder="suite or test id(s)" value={selection} onChange={(e)=>setSelection(e.target.value)} />
        <button className="btn success" onClick={startExecution}>Run</button>
      </div>

      {jobId && (
        <div className="card" style={{ marginTop: 12 }}>
          <strong>Execution Job:</strong> {jobId}
          <div style={{ marginTop: 6 }}>
            Status: <span className="status-pill status-running">{status?.status || 'unknown'}</span>
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
