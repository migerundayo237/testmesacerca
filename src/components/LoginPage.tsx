import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

interface LoginFormData {
  correo: string;
  password: string;
}

interface LoginFormErrors {
  correo?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({ correo: "", password: "" });
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  /** Valida el formulario antes de invocar Firebase. Retorna true si pasa. */
  const validate = (): boolean => {
    const errors: LoginFormErrors = {};
    const correo = formData.correo.trim();
    const password = formData.password;

    if (!correo) {
      errors.correo = "El correo es obligatorio";
    } else if (!EMAIL_REGEX.test(correo)) {
      errors.correo = "El correo no tiene un formato válido";
    }

    if (!password || !password.trim()) {
      errors.password = "La contraseña es obligatoria";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;
    if (isLoading) return;

    setIsLoading(true);
    try {
      await login(formData.correo.trim(), formData.password);
      navigate("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Iniciar Sesión</h1>
          <p className="text-slate-600">Ingresa a tu cuenta de MesaCerca</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                disabled={isLoading}
                placeholder="tu@email.com"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                  formErrors.correo
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-orange-500"
                }`}
              />
              {formErrors.correo && (
                <p className="mt-1 text-xs text-red-600">{formErrors.correo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                  formErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-orange-500"
                }`}
              />
              {formErrors.password && (
                <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/recuperar-contrasena"
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              ¿No tienes una cuenta?{" "}
              <Link to="/registro" className="text-orange-600 hover:text-orange-700 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
