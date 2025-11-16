// src/components/navbar.tsx
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";

export function Navbar() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isLogged");
    setLocation("/");
  };

  return (
    <nav className="w-full p-4 flex justify-end bg-gray-100 dark:bg-gray-800">
      <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
        <LogOut className="w-4 h-4 mr-2" />
        Déconnecter
      </Button>
    </nav>
  );
}
