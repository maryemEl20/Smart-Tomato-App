// src/pages/types.d.ts

// Déclare simulateData.js pour TypeScript
declare module "./simulateData" {
  export function pushRandomData(): void;
}

// Déclare firebase.js pour TypeScript
declare module "./firebase" {
  import { Database } from "firebase/database";
  export const database: Database;
}
