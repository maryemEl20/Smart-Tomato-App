import { SensorCard } from '../sensor-card';
import { Thermometer } from 'lucide-react';

export default function SensorCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <SensorCard
          icon={Thermometer}
          label="Température"
          value={24}
          unit="°C"
          status="normal"
          timestamp="Il y a 5 min"
          trend={[18, 20, 22, 21, 23, 24, 24]}
        />
        <SensorCard
          icon={Thermometer}
          label="Température"
          value={32}
          unit="°C"
          status="warning"
          timestamp="Il y a 2 min"
          trend={[24, 26, 28, 29, 30, 31, 32]}
        />
        <SensorCard
          icon={Thermometer}
          label="Température"
          value={38}
          unit="°C"
          status="critical"
          timestamp="Maintenant"
          trend={[28, 30, 32, 34, 35, 37, 38]}
        />
      </div>
    </div>
  );
}
