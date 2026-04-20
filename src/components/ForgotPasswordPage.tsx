import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { KeyRound, Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("El correo es obligatorio");
      return false;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError("El correo no tiene un formato válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Firebase envía el correo si la cuenta existe. Por seguridad el flujo nativo
      // no distingue entre correo registrado y no registrado, así que mostramos
      // siempre el mismo mensaje de éxito.
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Email Enviado!</h2>
            <p className="text-slate-600 mb-6">
              Hemos enviado instrucciones para recuperar tu contraseña a{" "}
              <strong>{email}</strong>
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Por favor revisa tu bandeja de entrada y sigue las instrucciones. Si no ves el
              email, revisa tu carpeta de spam.
            </p>
            <Link
              to="/login"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Recuperar Contraseña</h1>
          <p className="text-slate-600">Ingresa tu email y te enviaremos instrucciones</p>
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                disabled={isLoading}
                placeholder="tu@email.com"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                  emailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-orange-500"
                }`}
              />
              {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2 disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Instrucciones"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-orange-600 hover:text-orange-700">
              ← Volver al Login
            </Link>
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
