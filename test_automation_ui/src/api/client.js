const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  } else if (contentType.includes('text/html')) {
    data = await res.text();
  } else {
    // for binary or others, just return blob
    data = await res.blob().catch(() => null);
  }

  if (!res.ok) {
    const message = (data && data.error) || res.statusText || 'Request failed';
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function uploadSRS(file) {
  /** Upload SRS CSV as multipart/form-data to /srs/upload and return {jobId, filename} */
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/srs/upload`, {
    method: 'POST',
    body: form,
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function triggerGenerateCases(jobId) {
  /** POST to /generate/test-cases with { jobId } */
  const res = await fetch(`${BASE}/generate/test-cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function triggerGenerateScripts(jobId) {
  /** POST to /generate/test-scripts with { jobId } */
  const res = await fetch(`${BASE}/generate/test-scripts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function triggerExecuteTests(jobId) {
  /** POST to /execute with { jobId } */
  const res = await fetch(`${BASE}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getRuns() {
  /** GET /runs returns array of runs with summarized metadata */
  const res = await fetch(`${BASE}/runs`, { method: 'GET' });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getRun(runId) {
  /** GET /runs/:runId returns run metadata */
  const res = await fetch(`${BASE}/runs/${encodeURIComponent(runId)}`, { method: 'GET' });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getReport(runId) {
  /** GET /runs/:runId/report returns report JSON, try HTML path if needed by caller */
  const res = await fetch(`${BASE}/runs/${encodeURIComponent(runId)}/report`, { method: 'GET' });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function downloadArtifact(runId, filename) {
  /** GET /runs/:runId/artifacts/:filename return a Blob for download */
  const url = `${BASE}/runs/${encodeURIComponent(runId)}/artifacts/${encodeURIComponent(filename)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const error = new Error(text || `Failed to download ${filename}`);
    error.status = res.status;
    throw error;
  }
  const blob = await res.blob();
  return { blob, filename };
}

// PUBLIC_INTERFACE
export function getReportHtmlUrl(runId) {
  /** Returns direct URL to HTML report; use in an <a> or iframe if backend provides it */
  return `${BASE}/runs/${encodeURIComponent(runId)}/report.html`;
}
