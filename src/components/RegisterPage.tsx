import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface RegisterFormData {
  nombre: string;
  correo: string;
  celular: string;
  password: string;
  confirmarPassword: string;
}

interface RegisterFormErrors {
  nombre?: string;
  correo?: string;
  celular?: string;
  password?: string;
  confirmarPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Contraseña segura: mínimo 8, al menos una mayúscula, una minúscula, un número y un caracter especial.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PHONE_REGEX = /^\d{10}$/;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    correo: "",
    celular: "",
    password: "",
    confirmarPassword: "",
  });
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Limpia el error del campo apenas el usuario lo edita.
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  /** Aplica todas las reglas de validación del spec funcional. */
  const validate = (): boolean => {
    const errors: RegisterFormErrors = {};

    // --- Nombre completo ---
    const nombre = formData.nombre.trim();
    if (!nombre) {
      errors.nombre = "El nombre completo es obligatorio";
    } else if (/^\d+$/.test(nombre)) {
      errors.nombre = "El nombre no puede contener solo números";
    } else if (nombre.length < 5 || nombre.length > 100) {
      errors.nombre = "El nombre debe tener entre 5 y 100 caracteres";
    } else if (nombre.split(/\s+/).filter(Boolean).length < 2) {
      errors.nombre = "Ingresa al menos un nombre y un apellido";
    }

    // --- Correo electrónico ---
    const correo = formData.correo.trim();
    if (!correo) {
      errors.correo = "El correo es obligatorio";
    } else if (!EMAIL_REGEX.test(correo)) {
      errors.correo = "El correo no tiene un formato válido (ej: usuario@dominio.com)";
    }

    // --- Celular ---
    const celular = formData.celular.trim();
    if (!celular) {
      errors.celular = "El número de celular es obligatorio";
    } else if (!PHONE_REGEX.test(celular)) {
      errors.celular = "El celular debe contener exactamente 10 dígitos numéricos";
    }

    // --- Contraseña ---
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      errors.password =
        "Mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y carácter especial";
    }

    // --- Confirmación ---
    if (!formData.confirmarPassword) {
      errors.confirmarPassword = "Debes confirmar la contraseña";
    } else if (formData.password !== formData.confirmarPassword) {
      errors.confirmarPassword = "Las contraseñas no coinciden";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validate()) return;
    if (isLoading) return;

    setIsLoading(true);
    try {
      await register(
        formData.nombre.trim(),
        formData.correo.trim(),
        formData.celular.trim(),
        formData.password,
      );
      setSuccessMessage("Tu cuenta ha sido creada con éxito");
      // Espera corta para que el usuario vea el mensaje y redirige al login.
      setTimeout(() => navigate("/login"), 1500);
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
            <UserPlus className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Crear Cuenta</h1>
          <p className="text-slate-600">
            Únete a MesaCerca y reserva en tus restaurantes favoritos
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                disabled={isLoading}
                placeholder="Juan Pérez"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                  formErrors.nombre
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-orange-500"
                }`}
              />
              {formErrors.nombre && (
                <p className="mt-1 text-xs text-red-600">{formErrors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => handleChange("correo", e.target.value)}
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
                <Phone className="w-4 h-4 inline mr-2" />
                Celular
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={formData.celular}
                onChange={(e) =>
                  // Solo permite dígitos en el input para evitar letras/espacios.
                  handleChange("celular", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                disabled={isLoading}
                placeholder="3001234567"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                  formErrors.celular
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-orange-500"
                }`}
              />
              {formErrors.celular && (
                <p className="mt-1 text-xs text-red-600">{formErrors.celular}</p>
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
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                  formErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-orange-500"
                }`}
              />
              {formErrors.password ? (
                <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  Mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={formData.confirmarPassword}
                onChange={(e) => handleChange("confirmarPassword", e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                  formErrors.confirmarPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-orange-500"
                }`}
              />
              {formErrors.confirmarPassword && (
                <p className="mt-1 text-xs text-red-600">{formErrors.confirmarPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                Inicia sesión aquí
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
