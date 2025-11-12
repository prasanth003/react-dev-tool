import { detectReact } from "./detect-react";
import { highlightComponent, removeHighlight } from "./highlight-component";
import { analyzePerformance } from "./performance-analyze";
import { store } from "@/shared/store";
import { pauseTracking, resumeTracking, startTracking } from "./track-components";

let isMonitoring = false;

window.addEventListener('message', (event) => {
    
    if (event.data.type === 'REQUEST_REACT_DETECTION') {

        const result = detectReact();

        if (result.detected) {
            startTracking();
        }

        window.postMessage({
            type: 'REACT_DETECTION_RESULT',
            data: result
        }, '*');
    }

    if (event.data.type === 'HIGHLIGHT_COMPONENT') {
        highlightComponent(event.data.componentId);
    }
    
    if (event.data.type === 'UNHIGHLIGHT_COMPONENT') {
        removeHighlight();
    }

    if (event.data.type === 'CLEAR_TRACKING_DATA') {
        store.clearAll();
    }

    if (event.data.type === 'START_MONITORING') {
        if (!isMonitoring) {
            resumeTracking();
            isMonitoring = true;
        }
    }

    if (event.data.type === 'PAUSE_MONITORING') {
        console.log('⏸️ Pausing monitoring...');
        if (isMonitoring) {
            pauseTracking();
            isMonitoring = false;
        }
    }

});


export function sendComponentData() {

    const components = Array.from(store.getComponentData().values())
        .sort((a, b) => b.renderCount - a.renderCount);

    const issues = analyzePerformance(store.getComponentData());    

    window.postMessage({
        type: 'COMPONENT_RENDER_DATA',
        data: {
            renderCount: store.getRenderCount(),
            components: components.slice(0, 50),
            issues: issues,
            timestamp: Date.now()
        }
    }, '*');

}


const initialResult = detectReact();

window.postMessage({
    type: 'REACT_DETECTION_RESULT',
    data: initialResult
}, '*');