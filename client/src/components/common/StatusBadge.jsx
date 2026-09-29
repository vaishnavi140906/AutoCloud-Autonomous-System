import React from 'react';
import { getStatusColor } from '../../utils/formatters';

const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const colors = getStatusColor(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {status?.toLowerCase() === 'online' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75`}></span>
        )}
        {status?.toLowerCase() === 'critical' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.dot}`}></span>
      </span>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
