import { useEffect, useState } from "react";
import type { ComponentData, DetectionResult, PerformanceIssue, RenderEvents } from "./shared/types";

function Panel() {

    const [reactDetected, setReactDetected] = useState<DetectionResult>({ detected: false, method: null, version: null });
    const [components, setComponents] = useState<ComponentData[]>([]);
    const [issues, setIssues] = useState<PerformanceIssue[]>([]);
    const [totalRenders, setTotalRenders] = useState(0);
    const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
      const [selectedTab, setSelectedTab] = useState<'components' | 'issues'>('components');



    useEffect(() => {

        const messageListener = (message: any) => {

            if (message.type === 'REACT_DETECTED') {
                console.log('Panel received:', message.data);
                setReactDetected(message.data);
            }

            if (message.type === 'COMPONENT_DATA') {
                const renderData = message.data as RenderEvents;
                setTotalRenders(renderData.renderCount);
                setComponents(renderData.components);
                setIssues(message.data.issues || []);
            }

        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };

    }, []);

    const handleMouseEnter = (componentId: string) => {
        setHoveredComponent(componentId);

        // Send highlight request to content script
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
        setHoveredComponent(null);

        // Send unhighlight request
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'UNHIGHLIGHT_COMPONENT'
                });
            }
        });
    };

    const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#666';
    }
  };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '13px' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '10px' }}>⚡ React Perf Monitor</h1>
      
      {reactDetected?.detected ? (
        <div style={{ background: '#d4edda', padding: '8px', marginBottom: '15px', fontSize: '12px' }}>
          ✅ React {reactDetected.version}
        </div>
      ) : (
        <div style={{ background: '#f8d7da', padding: '8px', marginBottom: '15px', fontSize: '12px' }}>
          ❌ No React
        </div>
      )}
      
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalRenders}</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Total Renders</div>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{components.length}</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Components</div>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: issues.length > 0 ? '#dc3545' : '#28a745' }}>
            {issues.length}
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>Issues Found</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #ddd',
        marginBottom: '15px'
      }}>
        <button
          onClick={() => setSelectedTab('components')}
          style={{
            background: selectedTab === 'components' ? '#667eea' : 'transparent',
            color: selectedTab === 'components' ? 'white' : '#666',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Components ({components.length})
        </button>
        <button
          onClick={() => setSelectedTab('issues')}
          style={{
            background: selectedTab === 'issues' ? '#667eea' : 'transparent',
            color: selectedTab === 'issues' ? 'white' : '#666',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
            borderRadius: '4px 4px 0 0'
          }}
        >
          Issues ({issues.length})
        </button>
      </div>

      {/* Components Tab */}
      {selectedTab === 'components' && (
        <div>
          {components.length === 0 ? (
            <div style={{ color: '#999', fontSize: '12px', padding: '20px', textAlign: 'center' }}>
              Interact with the page to see component renders...
            </div>
          ) : (
            <div style={{ 
              maxHeight: '400px', 
              overflow: 'auto',
              border: '1px solid #ddd'
            }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                padding: '8px',
                background: '#f5f5f5',
                borderBottom: '1px solid #ddd',
                fontWeight: 'bold',
                fontSize: '11px',
                position: 'sticky',
                top: 0
              }}>
                <div>Component</div>
                <div style={{ textAlign: 'right' }}>Renders</div>
                <div style={{ textAlign: 'right' }}>Avg Time</div>
              </div>
              
              {components.map((comp) => (
                <div 
                  key={comp.id}
                  onMouseEnter={() => handleMouseEnter(comp.id)}
                  onMouseLeave={handleMouseLeave}
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    padding: '8px',
                    borderBottom: '1px solid #eee',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: hoveredComponent === comp.id ? '#e3f2fd' : 'transparent'
                  }}
                >
                  <div style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {comp.name}
                  </div>
                  <div style={{ 
                    textAlign: 'right',
                    color: comp.renderCount > 20 ? '#dc3545' : '#28a745',
                    fontWeight: 'bold'
                  }}>
                    {comp.renderCount}
                  </div>
                  <div style={{ 
                    textAlign: 'right',
                    color: comp.averageRenderTime > 16 ? '#dc3545' : '#28a745',
                    fontWeight: comp.averageRenderTime > 16 ? 'bold' : 'normal'
                  }}>
                    {comp.averageRenderTime.toFixed(1)}ms
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Issues Tab */}
      {selectedTab === 'issues' && (
        <div>
          {issues.length === 0 ? (
            <div style={{ 
              color: '#28a745', 
              fontSize: '14px', 
              padding: '30px', 
              textAlign: 'center',
              background: '#d4edda',
              borderRadius: '8px'
            }}>
              ✅ No performance issues detected!
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {issues.map((issue, idx) => (
                <div 
                  key={idx}
                  style={{
                    border: `2px solid ${getSeverityColor(issue.severity)}`,
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px',
                    background: 'white'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                      {issue.componentName}
                    </div>
                    <div style={{
                      background: getSeverityColor(issue.severity),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {issue.severity}
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    {issue.message}
                  </div>
                  
                  <div style={{
                    background: '#f8f9fa',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    borderLeft: '3px solid #667eea'
                  }}>
                    <strong>💡 Suggestion:</strong> {issue.suggestion}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    );
}

export default Panel;