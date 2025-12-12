import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { downloadBlob } from '../utils/download';
import Notifications from '../components/Notifications';

export default function ScriptsList() {
  const { getScripts, getScript, downloadScriptsZip } = useApi();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const load = async () => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const data = await getScripts();
      setItems(Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : []);
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to load scripts.');
    } finally {
      setBusy(false);
    }
  };

  const openScript = async (id) => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const data = await getScript(id);
      setActive(data);
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to load script.');
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    setBusy(true);
    try {
      const blob = await downloadScriptsZip();
      downloadBlob(blob, 'scripts.zip');
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to download ZIP.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card" aria-labelledby="scripts-title">
      <h2 id="scripts-title" style={{ marginTop: 0 }}>Scripts</h2>
      <div className="form-row">
        <button className="btn" onClick={downloadZip} disabled={busy}>Download All (ZIP)</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>List</h3>
          {busy && <div style={{ color: 'var(--muted)' }}>Loading...</div>}
          <ul>
            {items.map(s => (
              <li key={s.id} style={{ marginBottom: 8 }}>
                <button className="btn ghost" onClick={()=>openScript(s.id)}>{s.name || s.id}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Preview</h3>
          {active ? (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{active.content || 'No content'}</pre>
          ) : (
            <div style={{ color: 'var(--muted)' }}>Select a script to preview.</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <Notifications message={errorMsg} type="error" onClose={()=>setErrorMsg(null)} />
      </div>
    </div>
  );
}
