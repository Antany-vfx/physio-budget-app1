import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // must exist
import MonthlyPhysioApp from './MonthlyPhysioApp'; // match file name

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MonthlyPhysioApp />
  </React.StrictMode>
);
