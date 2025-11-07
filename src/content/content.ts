import type { DetectionResult } from "../shared/types";

window.addEventListener('message', (event) => {
    
    if (event.source !== window) return;
    
    if (event.data.type === 'REACT_DETECTION_RESULT') {

        console.log('Received detection result:', event.data);
        
        chrome.runtime.sendMessage({
            type: 'REACT_DETECTED',
            data: event.data.data as DetectionResult
        });
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', requestDetection);
} else {
    requestDetection();
}

function requestDetection() {
    window.postMessage({ type: 'REQUEST_REACT_DETECTION' }, '*');
}