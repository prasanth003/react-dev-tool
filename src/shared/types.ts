export type DetectionResult = {
    detected: boolean;
    method: string | null;
    version: string | null;
};

export type RenderEvents = {
    renderCount: number;
    components: ComponentData[];
    issues: PerformanceIssue[];
    timestamp: number;
};

export type ComponentData = {
    id: string;
    name: string;
    renderCount: number;
    timestamp: number;
    totalRenderDuration: number;
    averageRenderTime: number;
    slowestRender: number;   
};

export type PerformanceIssue = {
    componentId: string;
    componentName: string;
    type: 'slow-render' | 'excessive-renders' | 'unnecessary-render';
    severity: 'low' | 'medium' | 'high';
    message: string;
    suggestion: string;
}

export type Theme = 'light' | 'dark' | 'system';

export type ThemeContextType = {
    theme: Theme;
};