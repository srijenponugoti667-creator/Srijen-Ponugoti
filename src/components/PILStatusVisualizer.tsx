import React from 'react';
import { AlertCircle, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';

type PILStatus = 'Submitted' | 'Pending Review' | 'Admitted' | 'Disposed';

interface PILStatusVisualizerProps {
  status: PILStatus;
}

export const PILStatusVisualizer: React.FC<PILStatusVisualizerProps> = ({ status }) => {
  const getStatusConfig = (status: PILStatus) => {
    switch (status) {
      case 'Submitted':
        return {
          icon: <FileText className="w-4 h-4" />,
          color: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          label: 'Submitted'
        };
      case 'Pending Review':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-amber-950 text-amber-300 border-amber-800',
          label: 'Pending Review'
        };
      case 'Admitted':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: 'bg-emerald-950 text-emerald-400 border-emerald-800',
          label: 'Admitted'
        };
      case 'Disposed':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'bg-red-950 text-red-300 border-red-800',
          label: 'Disposed'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          label: status
        };
    }
  };

  const { icon, color, label } = getStatusConfig(status);

  return (
    <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border ${color} text-xs font-medium`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};
