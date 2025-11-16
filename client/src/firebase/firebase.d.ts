// src/pages/firebase.d.ts
declare module "./firebase" {
  import { Database } from "firebase/database";
  export const database: Database;
}
