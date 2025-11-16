import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertSeverity = "info" | "warning" | "critical";

interface AlertItemProps {
  id: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
  onResolve?: (id: string) => void;
}

const severityConfig = {
  info: {
    icon: Info,
    color: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    color: "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  critical: {
    icon: AlertCircle,
    color: "border-l-red-500 bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
};

export function AlertItem({
  id,
  severity,
  message,
  timestamp,
  resolved,
  onResolve,
}: AlertItemProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "border-l-4 rounded-lg p-4 flex items-start gap-4 transition-opacity",
        config.color,
        resolved && "opacity-50"
      )}
      data-testid={`alert-item-${id}`}
    >
      <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.iconColor)} />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground" data-testid={`text-message-${id}`}>
          {message}
        </p>
        <p className="text-xs text-muted-foreground mt-1" data-testid={`text-timestamp-${id}`}>
          {timestamp}
        </p>
      </div>

      {!resolved && onResolve && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onResolve(id)}
          data-testid={`button-resolve-${id}`}
        >
          <Check className="w-4 h-4 mr-1" />
          Résolu
        </Button>
      )}

      {resolved && (
        <span className="text-xs text-muted-foreground font-medium">
          Résolu
        </span>
      )}
    </div>
  );
}
