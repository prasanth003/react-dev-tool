import type { DetectionResult } from "../shared/types";

export function detectReact(): DetectionResult {
    try {
        if (import.meta.env.DEV) {
            console.log('🔍 Attempting to detect React...');
        }

        const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

        if (hook) {
            if (import.meta.env.DEV) {
                console.log('✅ React DevTools hook found:', hook);
            }

            if (hook.renderers && hook.renderers.size > 0) {
                let version = 'unknown';
                try {
                    const firstRenderer = hook.renderers.values().next().value;
                    version = firstRenderer?.version || 'unknown';
                } catch (e) {
                    if (import.meta.env.DEV) {
                        console.warn('Could not read version from renderer', e);
                    }
                }

                if (import.meta.env.DEV) {
                    console.log('📊 React version detected via hook:', version);
                }

                return {
                    detected: true,
                    method: 'devtools-hook',
                    version: version
                };
            }

            if (import.meta.env.DEV) {
                console.log('⚠️ React DevTools hook found, but no renderers attached (yet).');
            }
            // Do not return here, fall through to other detection methods
        } else {
            if (import.meta.env.DEV) {
                console.log('❌ React DevTools hook NOT found');
            }
        }

        if ((window as any).React) {
            if (import.meta.env.DEV) {
                console.log('✅ React found on window object');
            }
            return {
                detected: true,
                method: 'window.React',
                version: (window as any).React.version || 'unknown'
            };
        }

        if (import.meta.env.DEV) {
            console.log('❌ React not detected via any method');
        }
        return {
            detected: false,
            method: null,
            version: null
        };

    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('⚠️ Error during React detection:', error);
        }
        return {
            detected: false,
            method: null,
            version: null
        };
    }
}