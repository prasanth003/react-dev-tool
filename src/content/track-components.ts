import { getComponentId, getComponentName } from "./component-name";
import { sendComponentData } from "./main-world";
import { store } from "./store";

export function startTracking() {

    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (!hook) {
        console.error('Hook not available for tracking');
        return;
    }

    const renderers = hook.renderers || new Map();

    if (renderers.size === 0) {
        setTimeout(() => {
            if (hook.renderers && hook.renderers.size > 0) {
                startTracking();
            }
        }, 1000);
        return;
    }

    hook.on('operations', () => {
        try {
            parseOperations();
        } catch (error) {
            console.error('Error parsing operations:', error);
        }

    });

}

function parseOperations() {

    store.incrementRenderCount();

    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    const renderers = hook.renderers || new Map();

    const renderer = Array.from(renderers.values())[0] as any;

    if (!renderer) return;

    walkFiberTree();

    sendComponentData();
}


function walkFiberTree() {
    try {

        let fiberRoot = null;

        const commonRootIds = ['root', '__next', 'app', 'react-root', 'main'];
        
        for (const id of commonRootIds) {
            const element = document.getElementById(id);
            if (element) {
                const fiber = findFiberOnElement(element);
                if (fiber) {
                    fiberRoot = fiber;
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
                    fiberRoot = fiber;
                    break;
                }
            }
        }

        if (!fiberRoot) {
            console.log('No fiber found on any element');
            return;
        }
        
        traverseFiber(fiberRoot, 0);
        
    } catch (error) {
        console.error('Error walking fiber tree:', error);
    }
}


function findFiberOnElement(element: Element): any {
   
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
        
        const componentName = getComponentName(fiber);

        if (componentName) {

            const componentId = getComponentId(fiber);

            store.setFiber(componentId, fiber);

            const renderDuration = getRenderDuration(fiber);

            const existing = store.getComponent(componentId);

            if (existing) {
                existing.renderCount++;
                existing.timestamp = Date.now();
                existing.totalRenderDuration += renderDuration;
                existing.averageRenderTime = existing.totalRenderDuration / existing.renderCount;
                existing.slowestRender = Math.max(existing.slowestRender, renderDuration);
            } else {
                store.setComponent(componentId, {
                    id: componentId,
                    name: componentName,
                    renderCount: 1,
                    timestamp: Date.now(),
                    totalRenderDuration: renderDuration,
                    averageRenderTime: renderDuration,
                    slowestRender: renderDuration
                });
            }
        }

        if (fiber.child) {
            traverseFiber(fiber.child, depth + 1);
        }

        if (fiber.sibling) {
            traverseFiber(fiber.sibling, depth);
        }

    } catch (error) {
        console.error('Error in traverseFiber:', error);
    }
}


function getRenderDuration(fiber: any): number {
    try {
 
        if (fiber.actualDuration !== undefined) {
            return fiber.actualDuration;
        }
        
        if (fiber.selfBaseDuration !== undefined) {
            return fiber.selfBaseDuration;
        }
        
        return 0;
    } catch {
        return 0;
    }
}
