import type { ComponentData, PerformanceIssue } from "@/shared/types"

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)} ms`
  const sec = ms / 1000
  if (sec < 60) return `${sec.toFixed(1)} s`
  const min = sec / 60
  return `${min.toFixed(1)} m`
}


export function exportData(data: {
  totalRenders: number;
  components: ComponentData[];
  issues: PerformanceIssue[];
}): void {

  const report = {
    timestamp: new Date().toISOString(),
    totalRenders: data.totalRenders,
    components: data.components.map(c => ({
      name: c.name,
      renders: c.renderCount,
      avgTime: c.averageRenderTime.toFixed(2) + 'ms',
      slowestRender: c.slowestRender.toFixed(2) + 'ms'
    })),
    issues: data.issues.map(i => ({
      component: i.componentName,
      severity: i.severity,
      type: i.type,
      message: i.message,
      suggestion: i.suggestion
    }))
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `react-perf-report-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}