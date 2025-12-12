import React from 'react';
import './App.css';
import './theme.css';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Router from './routes/Router';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Sidebar />
        <main className="main" role="main">
          <Router />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
