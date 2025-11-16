import { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database, auth } from "../firebase/firebase"; 
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { RefreshCw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";

export default function Settings() {
  const { toast } = useToast();

  // État pour les informations de la ferme
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true);

  // État pour la gestion du mot de passe
  const [email, setEmail] = useState(""); // Email fixe (ne sera pas modifiable)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Récupérer les paramètres depuis Firebase Realtime Database au chargement
  useEffect(() => {
    const settingsRef = ref(database, "settings");
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFarmName(data.farmName || "");
        setLocation(data.location || "");
        setSoilType(data.soilType || "");
        setAutoUpdate(data.autoUpdate ?? true);
          if (auth.currentUser) {
            setEmail(auth.currentUser.email || ""); // البريد ثابت من Auth
          }
                }
              });

    return () => unsubscribe();
  }, []);

  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    if (!auth.currentUser) {
      toast({ title: "Erreur", description: "Vous devez être connecté pour modifier les paramètres." });
      return;
    }

    try {
      // Si mot de passe changé, nécessité de la ré-authentification
      if (newPassword) {
        if (!currentPassword) {
          toast({ title: "Erreur", description: "Veuillez saisir votre mot de passe actuel pour valider les modifications." });
          return;
        }
        const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      // Mise à jour du mot de passe si nécessaire
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }

      // Mise à jour des autres paramètres de la ferme dans Realtime Database
      await set(ref(database, "settings"), {
        farmName,
        location,
        soilType,
        autoUpdate,
      });

      toast({ title: "Succès", description: "Paramètres mis à jour avec succès." });

      // Réinitialiser les champs de mot de passe après sauvegarde
      setNewPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message });
    }
  };

  // Fonction pour synchroniser les données (exemple)
  const handleSync = () => {
    toast({
      title: "Synchronisation en cours",
      description: "Les données sont en cours de synchronisation avec le cloud.",
    });
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      {/* Titre et description */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground mt-1"> Gérez les informations de votre ferme et les préférences
          </p>
          </div>
        <div className="flex gap-3">
           <Navbar />
        </div>
        </div>
      {/* Informations sur la ferme */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Informations sur la ferme</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Nom de la ferme</Label>
            <Input id="farm-name" value={farmName} onChange={(e) => setFarmName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Emplacement</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="soil-type">Type de sol</Label>
            <Input id="soil-type" value={soilType} onChange={(e) => setSoilType(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Compte utilisateur - email fixe et mot de passe modifiable */}
<Card className="p-6">
  <h3 className="text-lg font-semibold mb-6">Compte utilisateur</h3>
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Nom d'utilisateur / Email</Label>
      {/* Input uniquement en lecture seule */}
      <Input
        id="email"
        value={email}
        readOnly
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="current-password">Mot de passe actuel</Label>
      <Input
        id="current-password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Requis pour valider le changement de mot de passe"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="new-password">Nouveau mot de passe</Label>
      <Input
        id="new-password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Laisser vide si pas de changement"
      />
    </div>
  </div>
</Card>

      {/* Gestion des horaires */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Gestion des horaires</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Mise à jour automatique</Label>
            <p className="text-sm text-muted-foreground">
              Actualiser les données capteurs automatiquement
            </p>
          </div>
          <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
        </div>
      </Card>

      {/* Apparence */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Apparence</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Mode sombre / clair</Label>
            <p className="text-sm text-muted-foreground">
              Basculer entre le thème clair et sombre
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Boutons de sauvegarde et synchronisation */}
      <div className="flex gap-4">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}
