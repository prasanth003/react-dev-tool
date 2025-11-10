import type { ComponentData, PerformanceIssue } from "../shared/types";

export function analyzePerformance(componentData: Map<string, ComponentData>): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];
    
    for (const [id, data] of componentData.entries()) {
        
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
    
    return issues.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
    });
}