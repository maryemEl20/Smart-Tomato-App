import { useState, useEffect } from "react";
import { AlertItem } from "@/components/alert-item";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebase";

function formatTimeSince(dateInput: string | Date) {
  const date = new Date(dateInput);
  date.setHours(date.getHours() + 1);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Il y a 0 minute";
  if (minutes < 60) return `Il y a ${minutes} minutes`;
  if (hours < 24) return hours === 1 ? "Il y a 1 heure" : `Il y a ${hours} heures`;
  return days === 1 ? "Il y a 1 jour" : `Il y a ${days} jours`;
}

interface SensorData {
  temperature: number;
  humidity: number;
  soil_moisture: number;
  fertilizer_level: number;
  water_level: number;
  ph: number;
  timestamp: string;
}

interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  resolved: boolean;
  value?: number; // لحفظ القيمة الحالية لكل تنبيه
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // تحميل التنبيهات المحلولة من localStorage
  const getResolvedAlerts = () => JSON.parse(localStorage.getItem("resolvedAlerts") || "{}") as Record<string, number>;

  const saveResolvedAlerts = (resolved: Record<string, number>) => {
    localStorage.setItem("resolvedAlerts", JSON.stringify(resolved));
  };

  useEffect(() => {
    const sensorRef = ref(database, "big_data");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const dataObj = snapshot.val();
      if (!dataObj) {
        setAlerts([]);
        return;
      }

      const dataArray = Object.values(dataObj) as SensorData[];
      const latestData = dataArray.reduce((prev, curr) =>
        new Date(curr.timestamp) > new Date(prev.timestamp) ? curr : prev
      );

      const thresholds = {
        temperature: { warning: 27, critical: 35 },
        humidity: { warning: 70, critical: 85 },
        soil_moisture: { warning: 40, critical: 20 },
        fertilizer_level: { warning: 50, critical: 20 },
        water_level: { warning: 60, critical: 30 },
        ph: { warning: 6.8, critical: 5.5 },
      };

      const timestampLabel = formatTimeSince(new Date(latestData.timestamp));

      const checkThreshold = (type: keyof typeof thresholds, value: number, label: string): Alert | null => {
        const th = thresholds[type];
        let severity: Alert["severity"] | null = null;

        if (["fertilizer_level", "water_level", "soil_moisture"].includes(type)) {
          if (value <= th.critical) severity = "critical";
          else if (value <= th.warning) severity = "warning";
        } else {
          if (value >= th.critical) severity = "critical";
          else if (value >= th.warning) severity = "warning";
        }

        if (!severity) return null;

        const msg =
          severity === "critical"
            ? `${label} critique (${value}) - nécessite action immédiate`
            : `${label} à surveiller (${value}) - vérifier bientôt`;

        return { id: `${label}-${type}`, severity, message: msg, timestamp: timestampLabel, resolved: false, value };
      };

      const newAlerts: Alert[] = [
        checkThreshold("temperature", latestData.temperature, "Température"),
        checkThreshold("humidity", latestData.humidity, "Humidité"),
        checkThreshold("soil_moisture", latestData.soil_moisture, "Humidité du sol"),
        checkThreshold("fertilizer_level", latestData.fertilizer_level, "Niveau d'engrais"),
        checkThreshold("water_level", latestData.water_level, "Niveau d'eau"),
        checkThreshold("ph", latestData.ph, "pH"),
        { id: "irrigation", severity: "info", message: "Arrosage programmé dans 1 heure", timestamp: timestampLabel, resolved: false },
        { id: "harvest", severity: "info", message: "Prochaine récolte prévue demain", timestamp: timestampLabel, resolved: false },
      ].filter(Boolean) as Alert[];

      const resolvedAlerts = getResolvedAlerts();

      // دمج التنبيهات المحلولة: إذا نفس القيمة المحلولة، نحتفظ بالحالة
      const mergedAlerts = newAlerts.map(a => {
        const prevValue = resolvedAlerts[a.id];
        if (prevValue !== undefined && prevValue === a.value) {
          return { ...a, resolved: true };
        }
        return a;
      });

      setAlerts(mergedAlerts);
    });

    return () => unsubscribe();
  }, []);

  const handleResolve = (id: string) => {
    setAlerts(prev => {
      const updated = prev.map(alert => (alert.id === id ? { ...alert, resolved: true } : alert));
      const resolvedIds: Record<string, number> = {};
      updated.forEach(a => { if (a.resolved && a.value !== undefined) resolvedIds[a.id] = a.value; });
      saveResolvedAlerts(resolvedIds);
      return updated;
    });
  };

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const criticalAlerts = unresolvedAlerts.filter(a => a.severity === "critical");
  const warningAlerts = unresolvedAlerts.filter(a => a.severity === "warning");
  const infoAlerts = unresolvedAlerts.filter(a => a.severity === "info");
  const resolvedAlerts = alerts.filter(a => a.resolved);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alertes</h1>
        <p className="text-muted-foreground mt-1">Notifications et événements importants</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Toutes ({unresolvedAlerts.length})</TabsTrigger>
          <TabsTrigger value="critical">Critiques ({criticalAlerts.length})</TabsTrigger>
          <TabsTrigger value="warning">Avertissements ({warningAlerts.length})</TabsTrigger>
          <TabsTrigger value="info">Infos ({infoAlerts.length})</TabsTrigger>
          <TabsTrigger value="resolved">Résolues ({resolvedAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {unresolvedAlerts.length === 0 ? <div className="text-center py-12 text-muted-foreground">Aucune alerte active</div> : unresolvedAlerts.map((alert) => <AlertItem key={alert.id} {...alert} onResolve={handleResolve} />)}
        </TabsContent>

        <TabsContent value="critical" className="mt-6 space-y-4">
          {criticalAlerts.length === 0 ? <div className="text-center py-12 text-muted-foreground">Aucune alerte critique</div> : criticalAlerts.map((alert) => <AlertItem key={alert.id} {...alert} onResolve={handleResolve} />)}
        </TabsContent>

        <TabsContent value="warning" className="mt-6 space-y-4">
          {warningAlerts.length === 0 ? <div className="text-center py-12 text-muted-foreground">Aucun avertissement</div> : warningAlerts.map((alert) => <AlertItem key={alert.id} {...alert} onResolve={handleResolve} />)}
        </TabsContent>

        <TabsContent value="info" className="mt-6 space-y-4">
          {infoAlerts.length === 0 ? <div className="text-center py-12 text-muted-foreground">Aucune info</div> : infoAlerts.map((alert) => <AlertItem key={alert.id} {...alert} onResolve={handleResolve} />)}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
          {resolvedAlerts.length === 0 ? <div className="text-center py-12 text-muted-foreground">Aucune alerte résolue</div> : resolvedAlerts.map((alert) => <AlertItem key={alert.id} {...alert} onResolve={handleResolve} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
