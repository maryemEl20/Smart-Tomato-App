// src/pages/dashboard.tsx
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { SensorCard } from "@/components/sensor-card";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Thermometer, Droplets, Leaf, FlaskRound, LogOut } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebase";
import { formatInTimeZone } from "date-fns-tz";
import { Dialog } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {

  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    soil_moisture: 0,
    water_level: 0,
    fertilizer_level: 0,
    ph: 0,
    timestamp: new Date(),
  });
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const [wateringDate, setWateringDate] = useState("2025-11-08T06:00:00");
  const [fertilizerDate, setFertilizerDate] = useState("2025-11-10T08:00:00");
  const [harvestDate, setHarvestDate] = useState("2025-11-25T00:00:00");

  const [modalOpen, setModalOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");

  const [prediction, setPrediction] = useState<{
    Irrigation_Label: number;
    Fertilisation_Label: number;
    Harvest_Label: number;
  } | null>(null);


const lastAlertStatus = useRef<{ [key: string]: boolean }>({});
const alertQueue = useRef<{ [key: string]: boolean }>({}); 

const checkAlerts = (sensorData: typeof data) => {
  const alerts = [
    { key: "humidity", condition: sensorData.humidity >= 85, title: "Humidité critique", description: `Le niveau d'humidité est ${sensorData.humidity}%`, type: "critical" },
    { key: "temperature", condition: sensorData.temperature >= 35, title: "Température critique", description: `Le niveau de température est ${sensorData.temperature}°C`, type: "critical" },
    { key: "soil_moisture", condition: sensorData.soil_moisture <= 20, title: "Soil Moisture faible", description: `Humidité du sol: ${sensorData.soil_moisture}%`, type: "critical" },
    { key: "water_level", condition: sensorData.water_level <= 50, title: "Niveau d'eau à surveiller", description: `Niveau d'eau: ${sensorData.water_level}%`, type: sensorData.water_level <= 30 ? "critical" : "warning" },
    { key: "fertilizer_level", condition: sensorData.fertilizer_level <= 50, title: "Niveau d'engrais bas", description: `Niveau d'engrais: ${sensorData.fertilizer_level}%`, type: sensorData.fertilizer_level <= 20 ? "critical" : "warning" },
    { key: "ph", condition: sensorData.ph <= 5.5, title: "pH critique", description: `Le pH est ${sensorData.ph}`, type: "critical" },
  ];

  alerts.forEach((alert, index) => {
    if (alert.condition && !lastAlertStatus.current[alert.key] && !alertQueue.current[alert.key]) {
      alertQueue.current[alert.key] = true; 
      

      setTimeout(() => {
        toast({
          title: alert.title,
          description: alert.description,
          variant: alert.type === "critical" ? "destructive" : "default",
        });

        lastAlertStatus.current[alert.key] = true;
        alertQueue.current[alert.key] = false; 
      }, index * 1500);
    } else if (!alert.condition) {
      lastAlertStatus.current[alert.key] = false;
    }
  });
};




  // 🔹 Lecture des données Firebase en temps réel avec checkAlerts
  useEffect(() => {
    const sensorRef = ref(database, "big_data");

    onValue(sensorRef, (snapshot) => {
      const raw = snapshot.val();
      if (!raw) return;

      const list = Array.isArray(raw) ? raw.filter(item => item) : Object.values(raw).filter(item => item);
      if (list.length === 0) return;

      list.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const latest = list[list.length - 1];

      const latestData = {
        temperature: Number(latest.temperature),
        humidity: Number(latest.humidity),
        soil_moisture: Number(latest.soil_moisture),
        water_level: Number(latest.water_level),
        fertilizer_level: Number(latest.fertilizer_level),
        ph: Number(latest.ph),
        timestamp: new Date(latest.timestamp),
      };

      setData(latestData);
      checkAlerts(latestData);
    });
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLogged");
    setLocation("/");
  };

  const getSensorStatus = (type: string, value: number) => {
    const thresholds = {
      temperature: { warning: 27, critical: 35 },
      humidity: { warning: 70, critical: 85 },
      soil_moisture: { warning: 40, critical: 20 },
      fertilizer_level: { warning: 50, critical: 20 },
      water_level: { warning: 60, critical: 30 },
      ph: { warning: 6.8, critical: 5.5 },
    };
    const threshold = thresholds[type as keyof typeof thresholds];
    if (!threshold) return "normal";

    if (["fertilizer_level", "water_level", "soil_moisture"].includes(type)) {
      if (value <= threshold.critical) return "critical";
      if (value <= threshold.warning) return "warning";
      return "normal";
    } else {
      if (value >= threshold.critical) return "critical";
      if (value >= threshold.warning) return "warning";
      return "normal";
    }
  };

  const generateTrend = () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 10) + 20);

  const handleEdit = (activityType: string) => {
    setCurrentActivity(activityType);
    let current = "";
    if (activityType === "watering") current = wateringDate;
    if (activityType === "fertilizer") current = fertilizerDate;
    if (activityType === "harvest") current = harvestDate;
    setNewDate(current);
    setModalOpen(true);
  };

  const saveNewDate = () => {
    if (!currentActivity) return;
    if (currentActivity === "watering") setWateringDate(newDate);
    if (currentActivity === "fertilizer") setFertilizerDate(newDate);
    if (currentActivity === "harvest") setHarvestDate(newDate);
    setModalOpen(false);
  };

  const getNextDateAndCountdown = (label: number, dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();

    if (label === 1) {
      if (diffMs <= 0) {
        return { nextDate: "À faire maintenant", countdown: format(now, "dd/MM/yyyy, HH:mm") };
      }
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
      let countdownStr = "";
      if (diffDays > 0) countdownStr += `${diffDays}j `;
      if (diffHours > 0) countdownStr += `${diffHours}h `;
      countdownStr += `${diffMinutes}m`;
      return { nextDate: format(target, "dd/MM/yyyy, HH:mm"), countdown: countdownStr };
    } else {
      return { nextDate: "Pas besoin", countdown: "-" };
    }
  };

  const getFertilizerStatusFromSensor = () => {
    if (data.fertilizer_level <= 20) return { label: 1, status: "À faire maintenant" };
    if (data.fertilizer_level <= 50) return { label: 1, status: "Programmé" };
    return { label: 0, status: "En attente" };
  };

  return (
    <div className="p-6 space-y-8">
      <Toaster />
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenue  dans la ferme Smart Tomato 🍅
          </h1>
          <p className="text-muted-foreground mt-1">Surveillez vos cultures en temps réel</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleRefresh} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Mettre à jour
          </Button>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnecter
          </Button>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <SensorCard icon={Thermometer} label="Température" value={data.temperature} unit="°C" status={getSensorStatus("temperature", data.temperature) as any} timestamp={formatInTimeZone(data.timestamp, "Africa/Casablanca", "HH:mm")} trend={generateTrend()} />
        <SensorCard icon={Droplets} label="Humidité" value={data.humidity} unit="%" status={getSensorStatus("humidity", data.humidity) as any} timestamp={formatInTimeZone(data.timestamp, "Africa/Casablanca", "HH:mm")} trend={generateTrend()} />
        <SensorCard icon={Leaf} label="Soil Moisture" value={data.soil_moisture} unit="%" status={getSensorStatus("soil_moisture", data.soil_moisture) as any} timestamp={formatInTimeZone(data.timestamp, "Africa/Casablanca", "HH:mm")} trend={generateTrend()} />
        <SensorCard icon={FlaskRound} label="Niveau d'engrais" value={data.fertilizer_level} unit="%" status={getSensorStatus("fertilizer_level", data.fertilizer_level) as any} timestamp={formatInTimeZone(data.timestamp, "Africa/Casablanca", "HH:mm")} trend={generateTrend()} />
        <SensorCard icon={Droplets} label="Niveau d'eau" value={data.water_level} unit="%" status={getSensorStatus("water_level", data.water_level) as any} timestamp={formatInTimeZone(data.timestamp, "Africa/Casablanca", "HH:mm")} trend={generateTrend()} />
        <SensorCard icon={Leaf} label="pH" value={data.ph} unit="" status={getSensorStatus("ph", data.ph) as any} timestamp={formatInTimeZone(data.timestamp, "Africa/Casablanca", "HH:mm")} trend={generateTrend()} />
      </div>

      {/* Activity Planning */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Planning des activités</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActivityCard type="watering" title="Prochain arrosage" {...getNextDateAndCountdown(prediction?.Irrigation_Label ?? 0, wateringDate)} status={prediction?.Irrigation_Label === 1 ? "Programmé" : "En attente"} onEdit={() => handleEdit("watering")} />
          {(() => {
            const fertStatus = getFertilizerStatusFromSensor();
            return <ActivityCard type="fertilizer" title="Apport d'engrais" {...getNextDateAndCountdown(fertStatus.label, fertilizerDate)} status={fertStatus.status} onEdit={() => handleEdit("fertilizer")} />;
          })()}
          <ActivityCard type="harvest" title="Prochaine récolte" {...getNextDateAndCountdown(prediction?.Harvest_Label ?? 0, harvestDate)} status={prediction?.Harvest_Label === 1 ? "Planifié" : "En attente"} onEdit={() => handleEdit("harvest")} />
        </div>

        {modalOpen && (
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-bold">Modifier {currentActivity}</h3>
              <input type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="border p-2 rounded w-full" />
              <div className="flex justify-end gap-2">
                <Button onClick={() => setModalOpen(false)}>Annuler</Button>
                <Button onClick={saveNewDate}>Enregistrer</Button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}
