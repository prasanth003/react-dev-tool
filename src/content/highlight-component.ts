import { store } from "./store";

let highlightOverlay: HTMLElement | null = null;

export function highlightComponent(componentId: string) {
    try {
        
        const fiber = store.getFiber(componentId);
        
        if (!fiber) {
            console.log('Fiber not found for:', componentId);
            return;
        }
        
        const domNode = findDOMNode(fiber);
        
        if (!domNode) {
            console.log('DOM node not found');
            return;
        }
                
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
        
        const rect = domNode.getBoundingClientRect();
        highlightOverlay.style.left = rect.left + window.scrollX + 'px';
        highlightOverlay.style.top = rect.top + window.scrollY + 'px';
        highlightOverlay.style.width = rect.width + 'px';
        highlightOverlay.style.height = rect.height + 'px';
        highlightOverlay.style.display = 'block';
        
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
                ${store.getComponent(componentId)?.name || 'Component'}
            </div>
        `;
        
    } catch (error) {
        console.error('Error highlighting component:', error);
    }
}

export function removeHighlight() {
    if (highlightOverlay) {
        highlightOverlay.style.display = 'none';
    }
}

function findDOMNode(fiber: any): Element | null {
    let current = fiber;
    
    while (current) {
    
        if (current.stateNode && current.stateNode instanceof Element) {
            return current.stateNode;
        }
        
        if (current.tag === 5 && current.stateNode) {
            return current.stateNode;
        }
        
        if (current.child) {
            current = current.child;
        } else if (current.sibling) {
            current = current.sibling;
        } else {
            current = current.return;
        }
        
        if (current === fiber.return) break;
    }
    
    return null;
}