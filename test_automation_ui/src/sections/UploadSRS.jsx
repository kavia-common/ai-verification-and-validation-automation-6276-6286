import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Notifications from '../components/Notifications';

export default function UploadSRS() {
  const { uploadSRS } = useApi();
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState('info');
  const [lastSrs, setLastSrs] = useState(null);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  const onUpload = async () => {
    if (!file) {
      setMsgType('error');
      setMsg('Please choose a CSV file to upload.');
      return;
    }
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setMsgType('error');
      setMsg('Only CSV files are allowed.');
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const data = await uploadSRS(file);
      setMsgType('success');
      setMsg(`Uploaded successfully. SRS ID: ${data.srs_id ?? 'N/A'}`);
      setLastSrs(data);
    } catch (e) {
      setMsgType('error');
      setMsg(e.friendlyMessage || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" aria-labelledby="upload-title">
      <h2 id="upload-title" style={{ marginTop: 0 }}>Upload SRS CSV</h2>
      <p>Upload your Software Requirements Specification CSV to start generating test cases.</p>
      <div className="form-row" role="group" aria-label="Upload controls">
        <input
          className="input"
          type="file"
          accept=".csv"
          onChange={onFileChange}
          aria-label="Choose CSV file"
        />
        <button className="btn" onClick={onUpload} disabled={busy} aria-busy={busy}>
          {busy ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {lastSrs && (
        <div style={{ marginTop: 12, fontSize: 14, color: 'var(--muted)' }}>
          Last upload: <strong>{lastSrs.filename || 'SRS'}</strong>{' '}
          {lastSrs.uploaded_at ? `(${new Date(lastSrs.uploaded_at).toLocaleString()})` : ''}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <Notifications message={msg} type={msgType} onClose={() => setMsg(null)} />
      </div>
    </div>
  );
}
