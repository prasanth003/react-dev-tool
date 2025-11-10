import { detectReact } from "./detect-react";
import { highlightComponent, removeHighlight } from "./highlight-component";
import { analyzePerformance } from "./performance-analyze";
import { store } from "./store";
import { startTracking } from "./track-components";


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