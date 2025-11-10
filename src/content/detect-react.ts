import type { DetectionResult } from "../shared/types";

export function detectReact(): DetectionResult {
    try {
        
        const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

        if (hook) {

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

        if ((window as any).React) {
            return {
                detected: true,
                method: 'window.React',
                version: (window as any).React.version || 'unknown'
            };
        }

        return {
            detected: false,
            method: null,
            version: null
        };

    } catch (error) {
        return {
            detected: false,
            method: null,
            version: null
        };
    }
}