import { AlertItem } from '../alert-item';
import { useState } from 'react';

export default function AlertItemExample() {
  const [alerts, setAlerts] = useState([
    { id: '1', severity: 'critical' as const, message: 'Température critique détectée (38°C)', timestamp: 'Il y a 2 min', resolved: false },
    { id: '2', severity: 'warning' as const, message: 'Niveau d\'engrais faible (15%)', timestamp: 'Il y a 15 min', resolved: false },
    { id: '3', severity: 'info' as const, message: 'Arrosage programmé dans 1 heure', timestamp: 'Il y a 30 min', resolved: false },
  ]);

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="p-8 bg-background">
      <div className="space-y-4 max-w-2xl">
        {alerts.map(alert => (
          <AlertItem key={alert.id} {...alert} onResolve={handleResolve} />
        ))}
      </div>
    </div>
  );
}
