import { useLocation } from "wouter";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [location, setLocation] = useLocation();

  const isLogged = localStorage.getItem("isLogged") === "true";

  if (!isLogged) {
    setLocation("/");
    return null;
  }

  return children;
}
