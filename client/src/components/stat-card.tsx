import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  iconColor?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <p className="text-2xl font-semibold text-foreground" data-testid={`text-value-${label.toLowerCase()}`}>
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg bg-primary/10", iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
