import type { DetectionResult, RenderEvents } from "../shared/types";

window.addEventListener('message', (event) => {
    
    if (event.source !== window) return;
    
    if (event.data.type === 'REACT_DETECTION_RESULT') {

        console.log('Received detection result:', event.data);
        
        chrome.runtime.sendMessage({
            type: 'REACT_DETECTED',
            data: event.data.data as DetectionResult
        });
    }

    if (event.data.type === 'COMPONENT_RENDER_DATA') {
        chrome.runtime.sendMessage({
            type: 'COMPONENT_DATA',
            data: event.data.data as RenderEvents
        });
    }

});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'HIGHLIGHT_COMPONENT') {
        // Forward to main world
        window.postMessage({
            type: 'HIGHLIGHT_COMPONENT',
            componentId: message.componentId
        }, '*');
    }
    
    if (message.type === 'UNHIGHLIGHT_COMPONENT') {
        // Forward to main world
        window.postMessage({
            type: 'UNHIGHLIGHT_COMPONENT'
        }, '*');
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