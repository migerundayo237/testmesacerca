// Componente de protección de rutas.
// Envuelve las rutas privadas: si no hay sesión activa, redirige a /login.
// Mientras Firebase resuelve el estado inicial (loading) no redirige — evita el parpadeo
// donde el usuario sí está logueado pero el listener aún no ha corrido.

import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Pantalla mínima de carga para no parpadear el login.
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-slate-500">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
