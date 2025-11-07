import type { DetectionResult } from "../shared/types";

window.addEventListener('message', (event) => {
    if (event.data.type === 'REQUEST_REACT_DETECTION') {
        console.log('Detection requested, checking...');
        
        const result = detectReact();
        
        window.postMessage({
            type: 'REACT_DETECTION_RESULT',
            data: result
        }, '*');
    }
});

function detectReact(): DetectionResult {
    try {
        // Now we can access the REAL window object!
        const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
        
        if (hook) {
            console.log('✅ React detected via DevTools Hook');
            
            // Extract version info
            let version = 'unknown';
            const renderers = hook.reactDevtoolsAgent?._rendererInterfaces;
            if (renderers) {
                const firstRenderer = Object.values(renderers)[0] as any;
                version = firstRenderer?.renderer?.version || 'unknown';
            }
            
            return {
                detected: true,
                method: 'devtools-hook',
                version: version
            };
        }
        
        // Fallback: check for React global
        if ((window as any).React) {
            console.log('✅ React detected via window.React');
            return {
                detected: true,
                method: 'window.React',
                version: (window as any).React.version || 'unknown'
            };
        }
        
        console.log('❌ React not detected');
        return {
            detected: false,
            method: null,
            version: null
        };
        
    } catch (error) {
        console.error('Error detecting React:', error);
        return {
            detected: false,
            method: null,
            version: null
        };
    }
}

const initialResult = detectReact();

window.postMessage({
    type: 'REACT_DETECTION_RESULT',
    data: initialResult
}, '*');