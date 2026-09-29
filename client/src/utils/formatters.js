export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'online':
    case 'active':
    case 'healthy':
    case 'completed':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
        glow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]',
      };
    case 'warning':
    case 'pending':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
        glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]',
      };
    case 'critical':
    case 'failed':
    case 'offline':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500',
        glow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-500',
        glow: 'shadow-[0_0_10px_rgba(100,116,139,0.5)]',
      };
  }
};

export const getBatteryColor = (level) => {
  if (level > 50) return 'text-emerald-400 stroke-emerald-400';
  if (level > 20) return 'text-amber-400 stroke-amber-400';
  return 'text-rose-400 stroke-rose-400';
};
