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
