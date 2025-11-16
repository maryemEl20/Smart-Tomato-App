import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SensorStatus = "normal" | "warning" | "critical";

interface SensorCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  status: SensorStatus;
  timestamp: string;
  trend?: number[];
}

const statusStyles = {
  normal: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20",
  warning: "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
  critical: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20",
};

const statusTextColors = {
  normal: "text-green-700 dark:text-green-400",
  warning: "text-yellow-700 dark:text-yellow-400",
  critical: "text-red-700 dark:text-red-400",
};

export function SensorCard({
  icon: Icon,
  label,
  value,
  unit,
  status,
  timestamp,
  trend = [],
}: SensorCardProps) {
  return (
    <Card className={cn("p-6", statusStyles[status])} data-testid={`card-sensor-${label.toLowerCase()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-5 h-5", statusTextColors[status])} />
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className={cn("text-3xl font-semibold", statusTextColors[status])} data-testid={`text-value-${label.toLowerCase()}`}>
          {value}
          <span className="text-lg ml-1">{unit}</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground" data-testid={`text-timestamp-${label.toLowerCase()}`}>
        Mis à jour: {timestamp}
      </div>

      {trend.length > 0 && (
        <div className="mt-4 h-12 flex items-end gap-1">
          {trend.map((val, idx) => (
            <div
              key={idx}
              className={cn("flex-1 rounded-sm", statusTextColors[status].replace('text-', 'bg-'))}
              style={{ height: `${(val / Math.max(...trend)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
