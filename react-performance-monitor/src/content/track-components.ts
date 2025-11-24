import { getComponentId, getComponentName } from "./component-name";
import { sendComponentData } from "./main-world";
import { store } from "@/shared/store";

let isPaused = false; // Start unpaused by default since we only start tracking when React is detected
let originalOnCommitFiberRoot: any = null;

export function startTracking() {

    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (!hook) {
        console.error('Hook not available for tracking');
        return;
    }

    // If renderers are not ready yet, wait a bit
    if (!hook.renderers || hook.renderers.size === 0) {
        setTimeout(() => {
            startTracking();
        }, 1000);
        return;
    }

    // Initial scan to populate data
    if (import.meta.env.DEV) {
        console.log('🌲 Initial fiber tree walk...');
    }
    walkFiberTree();
    sendComponentData();

    // Patch onCommitFiberRoot to detect updates
    if (hook.onCommitFiberRoot && hook.onCommitFiberRoot !== onCommitFiberRootHandler) {
        originalOnCommitFiberRoot = hook.onCommitFiberRoot;
        hook.onCommitFiberRoot = onCommitFiberRootHandler;
        if (import.meta.env.DEV) {
            console.log('👂 Attached onCommitFiberRoot listener');
        }
    } else if (!hook.onCommitFiberRoot) {
        // If it doesn't exist, define it
        hook.onCommitFiberRoot = onCommitFiberRootHandler;
        if (import.meta.env.DEV) {
            console.log('👂 Created onCommitFiberRoot listener');
        }
    }

}

function onCommitFiberRootHandler(rendererID: any, root: any, priorityLevel: any, didError: any) {

    // Call original if it exists
    if (originalOnCommitFiberRoot) {
        originalOnCommitFiberRoot(rendererID, root, priorityLevel, didError);
    }

    if (isPaused) return;

    try {
        // console.log('⚡ Commit detected');
        store.incrementRenderCount();

        if (root && root.current) {
            traverseFiber(root.current);
            sendComponentData();
        }
    } catch (error) {
        console.error('Error handling commit:', error);
    }
}

export function pauseTracking() {
    if (import.meta.env.DEV) {
        console.log('⏸️ Tracking paused');
    }
    isPaused = true;
}

export function resumeTracking() {
    if (import.meta.env.DEV) {
        console.log('▶️ Tracking resumed');
    }
    isPaused = false;
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
