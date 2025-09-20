import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider';
import { SkeletonProvider } from './components/skeleton';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SkeletonProvider>
          <App />
        </SkeletonProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
