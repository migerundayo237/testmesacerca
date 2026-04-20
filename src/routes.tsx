import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { RestaurantDetail } from "./components/RestaurantDetail";
import { ReservationPage } from "./components/ReservationPage";
import { RestaurantDashboard } from "./components/RestaurantDashboard";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { ProfilePage } from "./components/ProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Las rutas privadas se envuelven en <ProtectedRoute>.
// Si no hay sesión activa en Firebase Authentication, el componente redirige a /login.
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "restaurante/:id", Component: RestaurantDetail },
      { path: "login", Component: LoginPage },
      { path: "registro", Component: RegisterPage },
      { path: "recuperar-contrasena", Component: ForgotPasswordPage },

      // Rutas protegidas — requieren sesión activa.
      {
        path: "reservar/:id",
        element: (
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard-restaurante",
        element: (
          <ProtectedRoute>
            <RestaurantDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
