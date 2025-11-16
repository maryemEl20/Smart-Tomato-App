import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, LogIn } from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase"

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

 try {
  await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem("isLogged", "true");

    setError("");
    setLocation("/dashboard");
  } catch (err) {
    setError("Identifiants incorrects.");
  }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-green-100">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center items-center text-red-600">
            <Lock className="w-8 h-8 mr-2" />
            <CardTitle className="text-2xl font-bold">
              Connexion Admin Smart Tomato 🍅
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <Input
                type="email"
                placeholder="admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" className="w-full bg-red-600 text-white">
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
