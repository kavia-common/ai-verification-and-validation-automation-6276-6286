import React from 'react';
import { NavLink } from 'react-router-dom';
import DocsLinks from './DocsLinks';

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="brand" aria-label="Application Name">
        <span role="img" aria-label="robot">🤖</span>
        <span>AI V&V Automation</span>
      </div>

      <nav>
        <NavLink to="/upload" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Upload SRS</NavLink>
        <NavLink to="/generate" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Generate</NavLink>
        <NavLink to="/execute" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Execute</NavLink>
        <NavLink to="/results" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Results</NavLink>
        <NavLink to="/scripts" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Scripts</NavLink>
      </nav>

      <DocsLinks />
    </aside>
  );
}
