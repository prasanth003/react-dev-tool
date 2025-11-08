import type { DetectionResult, ComponentData, PerformanceIssue } from "../shared/types";

let renderCount = 0;
const componentData = new Map<string, ComponentData>();
const fiberMap = new Map<string, any>();
let highlightOverlay: HTMLElement | null = null;


window.addEventListener('message', (event) => {
    if (event.data.type === 'REQUEST_REACT_DETECTION') {
        console.log('Detection requested, checking...');

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

function startTracking() {

    console.log('🎯 Starting render tracking...');

    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (!hook) {
        console.error('Hook not available for tracking');
        return;
    }

    const renderers = hook.renderers || new Map();

    if (renderers.size === 0) {
        console.log('⏳ Waiting for renderer...');
        // Retry when renderer is available
        setTimeout(() => {
            if (hook.renderers && hook.renderers.size > 0) {
                startTracking();
            }
        }, 1000);
        return;
    }

    // Hook into React's render operations
    hook.on('operations', (operations: unknown) => {

        try {
            parseOperations(operations);
        } catch (error) {
            console.error('Error parsing operations:', error);
        }

    });

    console.log('✅ Tracking started');
}

function parseOperations(operations: any) {

    renderCount++;

    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const renderers = hook.renderers || new Map();

    console.log('operations received:', operations);
    console.log('renderers:', renderers);

    const renderer = Array.from(renderers.values())[0] as any;

    if (!renderer) return;

    walkFiberTree();

    sendComponentData();
}

function walkFiberTree() {
    try {
        console.log('🔍 Walking fiber tree...');

        let fiberRoot = null;
        let rootElement = null;

        const commonRootIds = ['root', '__next', 'app', 'react-root', 'main'];
        
        for (const id of commonRootIds) {
            const element = document.getElementById(id);
            if (element) {
                const fiber = findFiberOnElement(element);
                if (fiber) {
                    console.log(`✅ Found fiber on #${id}`);
                    fiberRoot = fiber;
                    rootElement = element;
                    break;
                }
            }
        }

        if (!fiberRoot) {
            console.log('⏳ Searching all elements for fiber...');
            const allDivs = document.querySelectorAll('div');
            
            for (let i = 0; i < Math.min(allDivs.length, 50); i++) {
                const element = allDivs[i];
                const fiber = findFiberOnElement(element);
                
                if (fiber) {
                    console.log(`✅ Found fiber on element:`, element.id || element.className);
                    fiberRoot = fiber;
                    rootElement = element;
                    break;
                }
            }
        }

        if (!fiberRoot) {
            console.log('❌ No fiber found on any element');
            return;
        }
        
        console.log('✅ Starting traversal from:', rootElement?.tagName);
        traverseFiber(fiberRoot, 0);
        console.log('✅ Traversal complete. Components found:', componentData.size);
        
    } catch (error) {
        console.error('Error walking fiber tree:', error);
    }
}

function findFiberOnElement(element: Element): any {
    // Check all keys on this element for fiber
    const keys = Object.keys(element);
    const fiberKey = keys.find(key => 
        key.startsWith('__reactFiber') ||
        key.startsWith('__reactInternalInstance') ||
        key.startsWith('__reactContainer')
    );
    
    if (fiberKey) {
        return (element as any)[fiberKey];
    }
    
    return null;
}

function traverseFiber(fiber: any, depth = 0) {

    if (!fiber) return;

    try {
        // Get component name
        const componentName = getComponentName(fiber);

        if (componentName) {
            console.log('  '.repeat(depth) + '→ Found component:', componentName);

            // Create unique ID for this component
            const componentId = getComponentId(fiber);

            fiberMap.set(componentId, fiber);
            const renderDuration = getRenderDuration(fiber);

            // Update or create component data
            const existing = componentData.get(componentId);

            if (existing) {
                existing.renderCount++;
                existing.timestamp = Date.now();
                existing.totalRenderDuration += renderDuration;
                existing.averageRenderTime = existing.totalRenderDuration / existing.renderCount;
                existing.slowestRender = Math.max(existing.slowestRender, renderDuration);
                console.log('  '.repeat(depth) + '  Updated:', componentName, 'count:', existing.renderCount);
            } else {
                componentData.set(componentId, {
                    id: componentId,
                    name: componentName,
                    renderCount: 1,
                    timestamp: Date.now(),
                    totalRenderDuration: renderDuration,
                    averageRenderTime: renderDuration,
                    slowestRender: renderDuration
                });
                console.log('  '.repeat(depth) + '  New component tracked');
            }
        }

        // Traverse children
        if (fiber.child) {
            traverseFiber(fiber.child, depth + 1);
        }

        // Traverse siblings
        if (fiber.sibling) {
            traverseFiber(fiber.sibling, depth);
        }
    } catch (error) {
        console.error('Error in traverseFiber:', error);
    }
}

function getRenderDuration(fiber: any): number {
    try {
        // React tracks actual render duration in development mode
        if (fiber.actualDuration !== undefined) {
            return fiber.actualDuration;
        }
        
        // Fallback: estimate based on fiber work
        if (fiber.selfBaseDuration !== undefined) {
            return fiber.selfBaseDuration;
        }
        
        return 0;
    } catch {
        return 0;
    }
}

function getComponentName(fiber: any): string | null {
    try {
        const type = fiber.type;
        
        if (!type) return null;
        
        // Skip HTML elements
        if (typeof type === 'string') {
            return null;
        }
        
        // Try multiple sources for the name
        let name = null;
        
        // 1. displayName (best - set by developers)
        if (type.displayName) {
            name = type.displayName;
        }
        // 2. Function/class name
        else if (type.name && type.name !== 'Unknown') {
            name = type.name;
        }
        // 3. Check if it's a memo/forwardRef wrapper
        else if (type.$$typeof) {
            const typeofSymbol = type.$$typeof.toString();
            
            if (typeofSymbol.includes('memo')) {
                // It's a React.memo() wrapped component
                if (type.type && type.type.name) {
                    name = `Memo(${type.type.name})`;
                } else {
                    name = 'Memo(Anonymous)';
                }
            } else if (typeofSymbol.includes('forward_ref')) {
                // It's a forwardRef component
                if (type.render && type.render.name) {
                    name = `ForwardRef(${type.render.name})`;
                } else {
                    name = 'ForwardRef';
                }
            }
        }
        // 4. Check fiber's own properties
        else if (fiber.elementType && fiber.elementType.name) {
            name = fiber.elementType.name;
        }
        // 5. Check for _debugSource (in development builds)
        else if (fiber._debugSource) {
            const fileName = fiber._debugSource.fileName;
            if (fileName) {
                // Extract component name from file path
                const match = fileName.match(/([^/\\]+)\.(jsx?|tsx?)$/);
                if (match) {
                    name = match[1];
                }
            }
        }
        
        // If still no name, try to get it from the fiber tag
        if (!name) {
            // Use fiber.tag to determine component type
            const tag = fiber.tag;
            switch (tag) {
                case 0: // FunctionComponent
                case 1: // ClassComponent
                    name = type.name || 'Anonymous';
                    break;
                case 11: // ForwardRef
                    name = 'ForwardRef';
                    break;
                case 14: // MemoComponent
                    name = 'Memo';
                    break;
                default:
                    return null;
            }
        }
        
        // Clean up the name
        if (name) {
            // Remove weird characters
            name = name.replace(/[^a-zA-Z0-9_$]/g, '');
            
            // If name is too short or looks minified, add more context
            if (name.length <= 2) {
                // Check fiber._debugOwner for parent component name
                if (fiber._debugOwner && fiber._debugOwner.type) {
                    const ownerName = fiber._debugOwner.type.name;
                    if (ownerName && ownerName.length > 2) {
                        name = `${ownerName}.${name}`;
                    } else {
                        name = `Component_${name}`;
                    }
                } else {
                    name = `Component_${name}`;
                }
            }
        }
        
        return name || null;
        
    } catch (error) {
        return null;
    }
}

function getComponentId(fiber: any): string {

    const name = getComponentName(fiber) || 'unknown';
    const key = fiber.key || '';
    const index = fiber.index || 0;

    return `${name}_${key}_${index}`;

}

function analyzePerformance(): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];
    
    console.log('🔍 Analyzing performance for', componentData.size, 'components');
    
    for (const [id, data] of componentData.entries()) {
        console.log(`Checking ${data.name}:`, {
            renderCount: data.renderCount,
            avgTime: data.averageRenderTime
        });
        
        // Issue 1: Slow renders (>16ms = 60fps threshold)
        if (data.averageRenderTime > 16) {
            console.log(`⚠️ SLOW RENDER: ${data.name} - ${data.averageRenderTime}ms`);
            issues.push({
                componentId: id,
                componentName: data.name,
                type: 'slow-render',
                severity: data.averageRenderTime > 50 ? 'high' : 'medium',
                message: `Average render time is ${data.averageRenderTime.toFixed(2)}ms (target: <16ms)`,
                suggestion: 'Use useMemo() for expensive calculations or React.memo() to prevent unnecessary renders'
            });
        }
        
        // Issue 2: Excessive renders
        if (data.renderCount > 20) {
            console.log(`⚠️ EXCESSIVE RENDERS: ${data.name} - ${data.renderCount} times`);
            issues.push({
                componentId: id,
                componentName: data.name,
                type: 'excessive-renders',
                severity: data.renderCount > 50 ? 'high' : 'medium',
                message: `Rendered ${data.renderCount} times`,
                suggestion: 'Wrap with React.memo() or check if parent is causing unnecessary re-renders'
            });
        }
    }
    
    console.log('📊 Total issues found:', issues.length);
    console.log('Issues:', issues);
    
    return issues.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
    });
}

function sendComponentData() {

    const components = Array.from(componentData.values())
        .sort((a, b) => b.renderCount - a.renderCount);

    const issues = analyzePerformance();

    console.log('📤 Sending component data:', {
        renderCount,
        componentsCount: components.length,
        issuesCount: issues.length
    });
    

    window.postMessage({
        type: 'COMPONENT_RENDER_DATA',
        data: {
            renderCount,
            components: components.slice(0, 50),
            issues: issues,
            timestamp: Date.now()
        }
    }, '*');

}

/** HIGHLIGHT  */

function highlightComponent(componentId: string) {
    try {
        console.log('Highlighting component:', componentId);
        
        // Get the fiber for this component
        const fiber = fiberMap.get(componentId);
        
        if (!fiber) {
            console.log('Fiber not found for:', componentId);
            return;
        }
        
        // Find the DOM node for this fiber
        const domNode = findDOMNode(fiber);
        
        if (!domNode) {
            console.log('DOM node not found');
            return;
        }
        
        console.log('Found DOM node:', domNode);
        
        // Create or update highlight overlay
        if (!highlightOverlay) {
            highlightOverlay = document.createElement('div');
            highlightOverlay.id = 'react-perf-highlight';
            highlightOverlay.style.position = 'absolute';
            highlightOverlay.style.border = '2px solid #0066ff';
            highlightOverlay.style.backgroundColor = 'rgba(0, 102, 255, 0.1)';
            highlightOverlay.style.pointerEvents = 'none';
            highlightOverlay.style.zIndex = '999999';
            highlightOverlay.style.boxSizing = 'border-box';
            document.body.appendChild(highlightOverlay);
        }
        
        // Position the overlay over the element
        const rect = domNode.getBoundingClientRect();
        highlightOverlay.style.left = rect.left + window.scrollX + 'px';
        highlightOverlay.style.top = rect.top + window.scrollY + 'px';
        highlightOverlay.style.width = rect.width + 'px';
        highlightOverlay.style.height = rect.height + 'px';
        highlightOverlay.style.display = 'block';
        
        // Add tooltip with component info
        highlightOverlay.innerHTML = `
            <div style="
                position: absolute;
                top: -25px;
                left: 0;
                background: #0066ff;
                color: white;
                padding: 4px 8px;
                font-size: 12px;
                font-family: monospace;
                border-radius: 3px;
                white-space: nowrap;
            ">
                ${componentData.get(componentId)?.name || 'Component'}
            </div>
        `;
        
    } catch (error) {
        console.error('Error highlighting component:', error);
    }
}

function removeHighlight() {
    if (highlightOverlay) {
        highlightOverlay.style.display = 'none';
    }
}

function findDOMNode(fiber: any): Element | null {
    // Walk up the fiber tree to find a DOM node
    let current = fiber;
    
    while (current) {
        // If this fiber has a DOM node (stateNode), return it
        if (current.stateNode && current.stateNode instanceof Element) {
            return current.stateNode;
        }
        
        // Check if it's a HostComponent (DOM element)
        if (current.tag === 5 && current.stateNode) { // 5 = HostComponent
            return current.stateNode;
        }
        
        // Try child first
        if (current.child) {
            current = current.child;
        }
        // Otherwise try sibling
        else if (current.sibling) {
            current = current.sibling;
        }
        // Otherwise go up
        else {
            current = current.return;
        }
        
        // Prevent infinite loop
        if (current === fiber.return) break;
    }
    
    return null;
}

const initialResult = detectReact();

window.postMessage({
    type: 'REACT_DETECTION_RESULT',
    data: initialResult
}, '*');