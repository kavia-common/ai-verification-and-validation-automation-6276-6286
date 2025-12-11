import React, { useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function UploadForm({ onUpload, uploading, jobId }) {
  /** Upload form for SRS CSV; calls onUpload(file). */
  const fileRef = useRef(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Please choose a .csv file to upload.');
      return;
    }
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Only .csv files are allowed.');
      return;
    }
    onUpload(file).catch((err) => {
      setError(err?.message || 'Upload failed.');
    });
  };

  return (
    <div className="card" aria-labelledby="upload-title">
      <div className="card-title" id="upload-title">Upload SRS</div>
      <div className="card-subtitle">Provide a CSV file containing requirements to begin the workflow.</div>
      <form onSubmit={handleSubmit} className="section">
        <div className="upload-row">
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="input"
            aria-label="Select CSV file"
            disabled={uploading}
          />
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
      {error && <div className="badge error" role="alert" aria-live="assertive">{error}</div>}
      {jobId && (
        <div className="section">
          <div className="small">Job created:</div>
          <div className="badge info" aria-label="Current job id">{jobId}</div>
        </div>
      )}
    </div>
  );
}
