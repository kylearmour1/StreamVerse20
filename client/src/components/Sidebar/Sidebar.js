import React, { useState } from 'react';
import Navigation from "./Navigation";
import "./Sidebar.css";

function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div
        className="sidebar-container"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: expanded ? '200px' : '0',
          transition: 'width 0.5s',
          overflow: 'hidden',
          backgroundColor: '#f1f1f1',
          zIndex: 9999,
        }}
      >
        <Navigation />
      </div>
      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '10px',
          right: expanded ? '220px' : '20px',
          zIndex: 9999,
          backgroundColor: 'black',
          color: 'whitesmoke',
        }}
      >
        {expanded ? "Hide Sidebar" : "Show Sidebar"}
      </button>
    </>
  );
}

export default Sidebar;
