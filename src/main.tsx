import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PanelLayout from '@/PanelDev';
import ThemeProvider from '@/providers/ThemeProvider';
// import Panel from '@/Panel';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ThemeProvider>
       <PanelLayout />
       {/* <Panel /> */}
     </ThemeProvider>
  </React.StrictMode>,
)
