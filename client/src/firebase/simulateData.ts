// src/pages/simulateData.ts
import { ref, set } from "firebase/database";
import { database } from "./firebase";

export function pushRandomData() {
  const timestamp = Date.now();
  set(ref(database, `capteurs/${timestamp}`), {
    temperature: Math.floor(Math.random() * 15) + 18,
    humidity: Math.floor(Math.random() * 20) + 60,
    soil_moisture: Math.floor(Math.random() * 10) + 15,
    waterLevel: Math.floor(Math.random() * 100),
    fertilizerLevel: Math.floor(Math.random() * 100),
    timestamp: new Date().toISOString(),
  });
}
