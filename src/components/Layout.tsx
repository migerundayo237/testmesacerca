import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  UtensilsCrossed,
  Building2,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const isRestaurantDashboard = location.pathname === "/dashboard-restaurante";

  /**
   * Cierra la sesión ejecutando signOut(auth) a través del servicio.
   * El listener onAuthStateChanged del AuthContext limpia el user,
   * y luego redirigimos explícitamente a /login.
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      setShowUserMenu(false);
      navigate("/login");
    } catch (err) {
      setLogoutError(err instanceof Error ? err.message : "No se pudo cerrar la sesión");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <UtensilsCrossed className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-slate-900">MesaCerca</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  !isRestaurantDashboard
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:text-orange-600"
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>Explorar</span>
              </Link>

              {/* El panel de restaurante es una ruta privada: solo lo mostramos si hay sesión. */}
              {user && (
                <Link
                  to="/dashboard-restaurante"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isRestaurantDashboard
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-600 hover:text-orange-600"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Panel Restaurante</span>
                </Link>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
                  >
                    <User className="w-5 h-5" />
                    <span>{user.name ? user.name.split(" ")[0] : "Cuenta"}</span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20">
                        <Link
                          to="/perfil"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4" />
                          Mi Perfil
                        </Link>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Cerrando sesión...
                            </>
                          ) : (
                            <>
                              <LogOut className="w-4 h-4" />
                              Cerrar Sesión
                            </>
                          )}
                        </button>
                        {logoutError && (
                          <p className="px-4 pt-2 text-xs text-red-600">{logoutError}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-orange-600 transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Ingresar</span>
                  </Link>
                  <Link
                    to="/registro"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Registrarse</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-600">
            <p>© 2026 MesaCerca. Prototipo de demostración.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
