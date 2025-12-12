import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UploadSRS from '../sections/UploadSRS';
import GenerationPanel from '../sections/GenerationPanel';
import ExecutionPanel from '../sections/ExecutionPanel';
import ResultsDashboard from '../sections/ResultsDashboard';
import ScriptsList from '../sections/ScriptsList';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={<UploadSRS />} />
      <Route path="/generate" element={<GenerationPanel />} />
      <Route path="/execute" element={<ExecutionPanel />} />
      <Route path="/results" element={<ResultsDashboard />} />
      <Route path="/scripts" element={<ScriptsList />} />
      <Route path="*" element={<Navigate to="/upload" replace />} />
    </Routes>
  );
}
