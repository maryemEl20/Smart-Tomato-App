import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Droplets, Leaf, FlaskRound } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType = "watering" | "fertilizer" | "harvest";

interface ActivityCardProps {
  type: ActivityType;
  title: string;
  nextDate: string;
  countdown: string;
  status: string;
  onEdit?: () => void;
}

const activityConfig = {
  watering: {
    icon: Droplets,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  },
  fertilizer: {
    icon: FlaskRound,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  },
  harvest: {
    icon: Leaf,
    color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  },
};

export function ActivityCard({
  type,
  title,
  nextDate,
  countdown,
  status,
  onEdit,
}: ActivityCardProps) {
  const config = activityConfig[type];
  const Icon = config.icon;

  return (
    <Card className="p-6" data-testid={`card-activity-${type}`}>
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-lg", config.color)}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <Badge variant="secondary">{status}</Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span data-testid={`text-date-${type}`}>{nextDate}</span>
          </div>
          
          <p className="text-sm font-medium text-foreground" data-testid={`text-countdown-${type}`}>
            {countdown}
          </p>
          
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onEdit}
              data-testid={`button-edit-${type}`}
            >
              Modifier le planning
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
