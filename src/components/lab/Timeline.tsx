import { cn } from '../../lib/utils';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

interface TimelineProps {
  decades: string[];
  selectedDecade: string;
  onSelectDecade: (decade: string) => void;
  statuses: Record<string, 'pending' | 'done' | 'error' | undefined>;
}

const statusConfig = {
  pending: { icon: <FaSpinner className="animate-spin" />, color: 'border-neutral-light/50 text-foreground/60' },
  done: { icon: <FaCheck />, color: 'border-foreground/50 text-foreground' },
  error: { icon: <FaTimes />, color: 'border-neutral-light text-foreground/60' },
};

export function Timeline({ decades, selectedDecade, onSelectDecade, statuses }: TimelineProps) {
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex gap-3 min-w-max">
        {decades.map(decade => {
          const status = statuses[decade] || 'pending';
          const config = statusConfig[status];
          return (
            <button
              key={decade}
              onClick={() => onSelectDecade(decade)}
              className={cn(
                "px-4 py-2 rounded-full border-2 text-sm font-bold flex items-center gap-2 transition-all duration-200",
                config.color,
                selectedDecade === decade 
                  ? 'bg-foreground/10 scale-110 border-foreground text-white' 
                  : 'bg-neutral/50 hover:bg-neutral/80'
              )}
            >
              {config.icon}
              {decade}
            </button>
          );
        })}
      </div>
    </div>
  );
}