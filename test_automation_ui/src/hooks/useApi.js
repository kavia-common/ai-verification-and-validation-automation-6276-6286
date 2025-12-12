import { useMemo } from 'react';
import axios from 'axios';

/**
 * PUBLIC_INTERFACE
 * useApi
 * Provides a preconfigured axios instance and high-level API methods for the backend.
 * Reads REACT_APP_API_BASE_URL from environment; no default hardcoding.
 */
export function useApi() {
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const client = useMemo(() => {
    const instance = axios.create({
      baseURL,
      headers: { 'Accept': 'application/json' }
    });

    instance.interceptors.response.use(
      (resp) => resp,
      (error) => {
        const message = error?.response?.data?.message || error.message || 'Request failed';
        return Promise.reject({ ...error, friendlyMessage: message });
      }
    );
    return instance;
  }, [baseURL]);

  // PUBLIC_INTERFACE
  const uploadSRS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const resp = await client.post('/srs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return resp.data; // expected: { srs_id, ... }
  };

  // PUBLIC_INTERFACE
  const triggerGenerateCases = async (srsId) => {
    const resp = await client.post('/jobs/generate-cases', { srs_id: srsId });
    return resp.data; // { job_id }
  };

  // PUBLIC_INTERFACE
  const triggerGenerateScripts = async (srsId) => {
    const resp = await client.post('/jobs/generate-scripts', { srs_id: srsId });
    return resp.data; // { job_id }
  };

  // PUBLIC_INTERFACE
  const triggerExecute = async (payload) => {
    const resp = await client.post('/jobs/execute', payload);
    return resp.data; // { job_id }
  };

  // PUBLIC_INTERFACE
  const getJobStatus = async (jobId) => {
    const resp = await client.get(`/jobs/${encodeURIComponent(jobId)}/status`);
    return resp.data; // { status, progress, message, run_id? }
  };

  // PUBLIC_INTERFACE
  const getRuns = async (params = {}) => {
    const resp = await client.get('/runs', { params });
    return resp.data; // array or {items,total}
  };

  // PUBLIC_INTERFACE
  const getRun = async (id) => {
    const resp = await client.get(`/runs/${encodeURIComponent(id)}`);
    return resp.data;
  };

  // PUBLIC_INTERFACE
  const getScripts = async (params = {}) => {
    const resp = await client.get('/scripts', { params });
    return resp.data;
  };

  // PUBLIC_INTERFACE
  const getScript = async (id) => {
    const resp = await client.get(`/scripts/${encodeURIComponent(id)}`);
    return resp.data;
  };

  // PUBLIC_INTERFACE
  const downloadScriptsZip = async () => {
    const resp = await client.get('/scripts/zip', { responseType: 'blob' });
    return resp.data;
  };

  // PUBLIC_INTERFACE
  const exportResultsCsv = async (params = {}) => {
    const resp = await client.get('/results/export', { params, responseType: 'blob' });
    return resp.data;
  };

  return {
    baseURL,
    client,
    uploadSRS,
    triggerGenerateCases,
    triggerGenerateScripts,
    triggerExecute,
    getJobStatus,
    getRuns,
    getRun,
    getScripts,
    getScript,
    downloadScriptsZip,
    exportResultsCsv,
  };
}
