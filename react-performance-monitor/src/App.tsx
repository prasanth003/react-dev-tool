import './App.css'
import { useEffect, useState } from 'react'
import { Header, type Actions } from '@/components/Header'
import { Stats } from '@/components/Stats'
import { Sidebar, type Tab } from '@/components/Sidebar'
import { ComponentTable } from '@/components/ComponentTable'
import { Issues } from '@/components/Issues'
import type { ComponentData, PerformanceIssue, RenderEvents } from './shared/types'
import { exportData } from './shared/utility'


function App() {

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [totalRenders, setTotalRenders] = useState<number>(0);
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [isReactDetected, setIsReactDetected] = useState<boolean | null>(null);

  useEffect(() => {

    // Check initial status
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'CHECK_REACT_STATUS'
        });
      }
    });

    const messageListener = (message: any) => {

      if (message.type === 'REACT_DETECTED') {
        setIsReactDetected(message.data.detected);
      }

      if (message.type === 'COMPONENT_DATA') {
        const renderData = message.data as RenderEvents;
        console.log('Received render data:', renderData);
        setTotalRenders(renderData.renderCount);
        setComponents(renderData.components);
        setIssues(message.data.issues || []);
      }

    };

    chrome?.runtime?.onMessage?.addListener(messageListener);

    return () => {
      chrome?.runtime?.onMessage?.removeListener(messageListener);
    };

  }, []);

  const handleAction = (action: Actions) => {

    switch (action) {
      case 'start':
      case 'pause':
        handleStartPause();
        break;
      case 'reset':
        handleClearData();
        break;
      case 'export':
        handleExportReport();
        break;
    }

  }

  const handleStartPause = () => {

    const newState = !isMonitoring;

    setIsMonitoring(newState);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: newState ? 'START_MONITORING' : 'PAUSE_MONITORING'
        });
      }
    });
  }

  const handleClearData = () => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'CLEAR_TRACKING_DATA'
        });
      }
    });

    setTotalRenders(0);
    setComponents([]);
    setIssues([]);
  }

  const handleExportReport = () => {

    if (components.length === 0 && issues.length === 0 && totalRenders === 0) {
      alert("No performance data to export.");
      return;
    }

    exportData({
      totalRenders,
      components,
      issues
    });

  };

  const handleMouseEnter = (componentId: string | null) => {
    console.log('hovered component id:', componentId);
    if (!componentId) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'HIGHLIGHT_COMPONENT',
          componentId: componentId
        });
      }
    });
  };

  const handleMouseLeave = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UNHIGHLIGHT_COMPONENT'
        });
      }
    });
  };


  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-mono">

      {/* Main UI - Always rendered but covered if not detected */}
      <div className='fixed top-0 left-0 w-full z-10 bg-background border-b border-[#cccccc1f]'>
        <Header onAction={(action: Actions) => handleAction(action)} isMonitoring={isMonitoring} />
      </div>

      <div className='pt-10 pb-4'>

        <Stats totalComponents={components?.length} totalRenders={totalRenders} totalIssues={issues?.length} />

        <div className='flex h-[calc(100vh-80px)]'>

          <div className='w-40 border-r border-[#cccccc1f] text-left'>
            <Sidebar activeTab={activeTab} setActiveTab={(tab: Tab) => setActiveTab(tab)} />
          </div>

          <div className='flex-1 overflow-hidden'>

            {
              !isMonitoring && totalRenders === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Please click Start to begin monitoring</p>
                </div>
              ) :
                activeTab === "overview" ?
                  <ComponentTable
                    data={components}
                    onHoverComponent={(id: string | null) => handleMouseEnter(id)}
                    onUnhoverComponent={() => handleMouseLeave()}
                  /> :
                  activeTab === "issues" ? <Issues issues={issues} /> :
                    <div className='p-4 text-sm text-muted-foreground'>Performance data is not available.</div>
            }

          </div>

        </div>

      </div>

      {/* Overlay for Non-React Apps or Loading */}
      {(isReactDetected === false || isReactDetected === null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="max-w-md p-6 text-center space-y-4">
            {isReactDetected === null ? (
              <>
                <h2 className="text-xl font-bold">Connecting to React...</h2>
                <p className="text-muted-foreground">Waiting for React DevTools hook...</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-destructive">React Not Detected</h2>
                <p className="text-muted-foreground">
                  This page does not appear to be using React, or the React DevTools hook is not available.
                </p>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md text-left font-mono mt-4">
                  <p className="font-bold mb-1">Troubleshooting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure this is a React application (v16+)</li>
                    <li>Make sure you are using a development build</li>
                    <li>Refresh the page and try again</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default App
