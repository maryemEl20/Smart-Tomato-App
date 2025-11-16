// src/pages/fillFirebase.js
import { ref, set, remove } from "firebase/database";
import { database } from "../pages/firebase.js";
import { pushRandomData } from "../pages/simulateData.js";

async function fillFirebase() {
  const rootRef = ref(database, "capteurs");

  await remove(rootRef);
  console.log("Données anciennes supprimées.");

  for (let i = 0; i < 10; i++) {
    pushRandomData();
  }

  console.log("Firebase remplie avec succès !");
}

fillFirebase();
