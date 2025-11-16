import { useState, useEffect } from "react";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { ThermometerSun, Droplets, TrendingUp, CloudRain, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebase";
import { Navbar } from "@/components/Navbar";

// Types pour les données
interface SensorData {
  temperature: number;
  humidity: number;
  water_level: number;
  fertilizer_level: number;
  ph: number;
  timestamp: string;
}

interface Activity {
  date: string;
  type: string;
  status: string;
}

export default function Analytics() {
  const [temperatureData, setTemperatureData] = useState<{ day: string; value: number }[]>([]);
  const [humidityData, setHumidityData] = useState<{ day: string; value: number }[]>([]);
  const [waterData, setWaterData] = useState<{ day: string; value: number }[]>([]);
  const [fertilizerData, setFertilizerData] = useState<{ day: string; value: number }[]>([]);
  const [phData, setPhData] = useState<{ day: string; value: number }[]>([]);

  const [stats, setStats] = useState({
    tempMoyenne: 0,
    tempMax: 0,
    humiditeMoyenne: 0,
    waterMoyenne: 0,
    waterMax: 0,
    fertMoyenne: 0,
    fertMax: 0,
    phMoyenne: 0,
  });

  const [activityHistory, setActivityHistory] = useState<Activity[]>([
    { date: "2025-11-05", type: "Arrosage", status: "Terminé" },
    { date: "2025-11-06", type: "Fertilisation", status: "En cours" },
    { date: "2025-11-07", type: "Récolte", status: "Prévu" },
  ]);

  useEffect(() => {
    const sensorRef = ref(database, "big_data");
    onValue(sensorRef, (snapshot) => {
      const rawData = snapshot.val();
      if (!rawData) return;

      // Convertir en array et ignorer les éléments null
      const dataList = Array.isArray(rawData)
        ? rawData.filter((item) => item)
        : Object.values(rawData).filter((item) => item);

      if (dataList.length === 0) return;

      // Trier par timestamp
      dataList.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      const latest7 = dataList.slice(-7);

      const tempSeries: { day: string; value: number }[] = [];
      const humSeries: { day: string; value: number }[] = [];
      const waterSeries: { day: string; value: number }[] = [];
      const fertSeries: { day: string; value: number }[] = [];
      const phSeries: { day: string; value: number }[] = [];

      let tempSum = 0, humSum = 0, waterSum = 0, fertSum = 0, phSum = 0;
      let tempMax = -Infinity, waterMax = -Infinity, fertMax = -Infinity;

      latest7.forEach((d: SensorData) => {
        const date = new Date(d.timestamp);
        const day = date.toLocaleDateString("fr-FR", { weekday: "short" });

        tempSeries.push({ day, value: d.temperature });
        humSeries.push({ day, value: d.humidity });
        waterSeries.push({ day, value: d.water_level });
        fertSeries.push({ day, value: d.fertilizer_level });
        phSeries.push({ day, value: d.ph });

        tempSum += d.temperature;
        humSum += d.humidity;
        waterSum += d.water_level;
        fertSum += d.fertilizer_level;
        phSum += d.ph;

        if (d.temperature > tempMax) tempMax = d.temperature;
        if (d.water_level > waterMax) waterMax = d.water_level;
        if (d.fertilizer_level > fertMax) fertMax = d.fertilizer_level;
      });

      setTemperatureData(tempSeries);
      setHumidityData(humSeries);
      setWaterData(waterSeries);
      setFertilizerData(fertSeries);
      setPhData(phSeries);

      setStats({
        tempMoyenne: parseFloat((tempSum / latest7.length).toFixed(1)),
        tempMax,
        humiditeMoyenne: parseFloat((humSum / latest7.length).toFixed(1)),
        waterMoyenne: parseFloat((waterSum / latest7.length).toFixed(1)),
        waterMax,
        fertMoyenne: parseFloat((fertSum / latest7.length).toFixed(1)),
        fertMax,
        phMoyenne: parseFloat((phSum / latest7.length).toFixed(2)),
      });
    });
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* ---- Header ---- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analyse</h1>
          <p className="text-muted-foreground mt-1">Statistiques et tendances de vos cultures 🍅</p>
        </div>
          <div className="flex gap-3">
                  <Navbar />

        </div>
      </div>

      {/* ---- Statistiques ---- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={ThermometerSun} label="Température moyenne" value={`${stats.tempMoyenne}°C`} subValue="Cette semaine" iconColor="text-orange-500" />
        <StatCard icon={TrendingUp} label="Température max" value={`${stats.tempMax}°C`} subValue="Cette semaine" iconColor="text-red-500" />
        <StatCard icon={Droplets} label="Humidité moyenne" value={`${stats.humiditeMoyenne}%`} subValue="Tendance stable" iconColor="text-blue-500" />
        <StatCard icon={CloudRain} label="pH moyen" value={stats.phMoyenne.toString()} subValue="Cette semaine" iconColor="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard icon={Droplets} label="Niveau d'eau moyen" value={`${stats.waterMoyenne}%`} subValue="Cette semaine" iconColor="text-blue-500" />
        <StatCard icon={CloudRain} label="Fertilisation max" value={`${stats.fertMax}`} subValue="Cette semaine" iconColor="text-green-500" />
      </div>

      {/* ---- Graphiques ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card dark:bg-gray-900 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Évolution de la température</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={{ fill: "hsl(var(--chart-1))" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-card dark:bg-gray-900 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Évolution de l'humidité</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={humidityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card dark:bg-gray-900 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Niveau d'eau</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="blue" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-card dark:bg-gray-900 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Fertilisation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fertilizerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="green" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ---- Historique des activités ---- */}
      <Card className="p-6 bg-card dark:bg-gray-900 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Historique des activités</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Type d'activité</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {activityHistory.map((activity, idx) => {
                let colorClass = "";
                if (activity.status === "Terminé") colorClass = "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400";
                else if (activity.status === "En cours") colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400";
                else colorClass = "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";

                return (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm">{activity.date}</td>
                    <td className="py-3 px-4 text-sm">{activity.type}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---- Recommandations automatiques ---- */}
      <Card className="p-6 bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recommandations automatiques</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span className="text-sm">La température est optimale pour la croissance des tomates (20-28°C)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span className="text-sm">L'humidité est légèrement élevée — surveillez les risques de moisissures</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span className="text-sm">Le niveau d'engrais est suffisant. Prochain apport prévu dans 2 jours</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
