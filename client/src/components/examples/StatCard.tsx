import { StatCard } from '../stat-card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <StatCard
          icon={Activity}
          label="Moyenne"
          value="24.5°C"
          subValue="Cette semaine"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Maximum"
          value="32°C"
          subValue="Mercredi 13:00"
          iconColor="text-red-600 dark:text-red-400"
        />
        <StatCard
          icon={TrendingDown}
          label="Minimum"
          value="18°C"
          subValue="Lundi 05:00"
          iconColor="text-green-600 dark:text-green-400"
        />
      </div>
    </div>
  );
}
