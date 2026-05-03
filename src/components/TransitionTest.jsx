// TEST COMPONENT - Add this temporarily to verify transitions work
// Add to any page to see if transitions are active

import React from 'react';
import { useLocation } from 'react-router-dom';

export default function TransitionTest() {
  const location = useLocation();
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(124, 58, 237, 0.9)',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '10px',
      zIndex: 10000,
      fontSize: '14px',
      fontFamily: 'monospace',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div><strong>🎬 Transition Test</strong></div>
      <div>Current: {location.pathname}</div>
      <div style={{fontSize: '12px', marginTop: '5px', opacity: 0.8}}>
        If you see this updating, routing works!
      </div>
    </div>
  );
}
