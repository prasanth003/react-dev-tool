import { useEffect, useState } from "react";
import type { DetectionResult } from "./shared/types";

function Panel() {

    const [reactDetected, setReactDetected] = useState<DetectionResult>({ detected: false, method: null, version: null });

    useEffect(() => {

        const messageListener = (message: any) => {
            if (message.type === 'REACT_DETECTED') {
                console.log('Panel received:', message.data);
                setReactDetected(message.data);
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };

    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
                ⚡ React Performance Monitor
            </h1>

            {reactDetected === null ? (
                <div style={{ color: '#666' }}>
                    🔍 Checking for React...
                </div>
            ) : reactDetected.detected ? (
                <div style={{
                    padding: '15px',
                    background: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px',
                    color: '#155724'
                }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                        ✅ React Detected!
                    </div>
                    <div>Method: {reactDetected.method}</div>
                    <div>Version: {reactDetected.version}</div>
                </div>
            ) : (
                <div style={{
                    padding: '15px',
                    background: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    color: '#721c24'
                }}>
                    ❌ React Not Detected
                </div>
            )}

            <div style={{ marginTop: '30px', color: '#666', fontSize: '14px' }}>
                <strong>Next:</strong> We'll track component renders here!
            </div>
        </div>
    );
}

export default Panel;