import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';
import ResultsTable from '../components/ResultsTable';
import ReportModal from '../components/ReportModal';
import { downloadBlob } from '../utils/download';
import Notifications from '../components/Notifications';

export default function ResultsDashboard() {
  const { getRuns, getRun, exportResultsCsv } = useApi();
  const [filters, setFilters] = useState({ status: '', q: '' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openRun, setOpenRun] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getRuns({ status: filters.status || undefined, q: filters.q || undefined });
      setItems(Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : []);
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to load results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const onOpen = async (row) => {
    try {
      const data = await getRun(row.id);
      setOpenRun(data);
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to load run details.');
    }
  };

  const onExport = async () => {
    try {
      const blob = await exportResultsCsv({ status: filters.status || undefined, q: filters.q || undefined });
      downloadBlob(blob, 'results.csv');
    } catch (e) {
      setErrorMsg(e.friendlyMessage || 'Failed to export CSV.');
    }
  };

  const statuses = useMemo(() => ([
    { value: '', label: 'All' },
    { value: 'pass', label: 'Pass' },
    { value: 'fail', label: 'Fail' },
    { value: 'running', label: 'Running' },
  ]), []);

  return (
    <div className="card" aria-labelledby="res-title">
      <h2 id="res-title" style={{ marginTop: 0 }}>Results Dashboard</h2>

      <div className="toolbar">
        <div className="form-row" role="group" aria-label="Filters">
          <label htmlFor="status">Status</label>
          <select id="status" value={filters.status} onChange={(e)=>setFilters(f=>({...f,status: e.target.value}))}>
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <label htmlFor="q">Search</label>
          <input id="q" className="input" value={filters.q} onChange={(e)=>setFilters(f=>({...f,q: e.target.value}))} placeholder="Keyword" />
          <button className="btn" onClick={load} aria-busy={loading}>{loading ? 'Loading...' : 'Apply'}</button>
        </div>

        <div className="form-row" role="group" aria-label="Exports">
          <button className="btn ghost" onClick={onExport}>Export CSV</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <ResultsTable items={items} onOpen={onOpen} />
      </div>

      <ReportModal open={!!openRun} data={openRun} onClose={()=>setOpenRun(null)} />

      <div style={{ marginTop: 12 }}>
        <Notifications message={errorMsg} type="error" onClose={()=>setErrorMsg(null)} />
      </div>
    </div>
  );
}
