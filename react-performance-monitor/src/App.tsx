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
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);

  useEffect(() => {

    const messageListener = (message: any) => {
      
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
          type: newState ? 'START_MONITORING': 'PAUSE_MONITORING'
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
    <>

      <div className='fixed top-0 left-0 w-full z-10 bg-background font-mono'>
        <Header onAction={(action: Actions) => handleAction(action)} isMonitoring={isMonitoring}/>
      </div>

      <div className='mt-9 font-mono'>

        <Stats totalComponents={components?.length} totalRenders={totalRenders} totalIssues={issues?.length} />

        <div className='flex h-full'>

          <div className='w-40 border-r border-[#cccccc1f] text-left'>
            <Sidebar activeTab={activeTab} setActiveTab={(tab: Tab) => setActiveTab(tab)} />
          </div>

          <div className='flex-1'>

            {
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

    </>
  )
}

export default App
