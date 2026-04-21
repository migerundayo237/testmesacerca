import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Lock,
  Trash2,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  Edit2,
  X,
  Loader2,
} from "lucide-react";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PHONE_REGEX = /^\d{10}$/;

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updatePassword, updateProfile, deleteAccount } = useAuth();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [profileErrors, setProfileErrors] = useState<{ name?: string; phone?: string }>({});

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  const [deletePasswordConfirm, setDeletePasswordConfirm] = useState("");

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  // ProtectedRoute ya garantiza que haya usuario, pero mantenemos el guard
  // por si el componente se monta en algún flujo no envuelto.
  if (!user) {
    navigate("/login");
    return null;
  }

  // ================= Actualizar perfil =================
  const validateProfile = (): boolean => {
    const errors: { name?: string; phone?: string } = {};
    const name = profileData.name.trim();
    const phone = profileData.phone.trim();

    if (!name) {
      errors.name = "El nombre es obligatorio";
    } else if (name.length < 5 || name.length > 100) {
      errors.name = "El nombre debe tener entre 5 y 100 caracteres";
    } else if (name.split(/\s+/).filter(Boolean).length < 2) {
      errors.name = "Ingresa al menos un nombre y un apellido";
    }

    if (!phone) {
      errors.phone = "El celular es obligatorio";
    } else if (!PHONE_REGEX.test(phone)) {
      errors.phone = "El celular debe contener exactamente 10 dígitos";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateProfile()) return;
    if (isUpdatingProfile) return;

    setIsUpdatingProfile(true);
    try {
      await updateProfile(profileData.name.trim(), profileData.phone.trim());
      setMessage({ type: "success", text: "Datos personales actualizados correctamente" });
      setEditingProfile(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error al actualizar datos",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // ================= Cambiar contraseña =================
  const validatePassword = (): boolean => {
    const errors: { current?: string; new?: string; confirm?: string } = {};

    if (!passwordData.current) {
      errors.current = "La contraseña actual es obligatoria";
    }
    if (!passwordData.new) {
      errors.new = "La nueva contraseña es obligatoria";
    } else if (!PASSWORD_REGEX.test(passwordData.new)) {
      errors.new =
        "Mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial";
    }
    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = "Las contraseñas no coinciden";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validatePassword()) return;
    if (isChangingPassword) return;

    setIsChangingPassword(true);
    try {
      // updatePassword hace reautenticación con la contraseña actual + update real en Firebase.
      await updatePassword(passwordData.current, passwordData.new);
      setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
      setPasswordData({ current: "", new: "", confirm: "" });
      setShowChangePassword(false);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "No se pudo actualizar la contraseña";
        // 👇 If it's wrong current password → show under field
        if (errorMessage.toLowerCase().includes("contraseña actual")) {
          setPasswordErrors((prev) => ({
          ...prev,
          current: errorMessage,
        }));
        } else {
        // 👇 Other errors still go to the top
          setMessage({
            type: "error",
            text: errorMessage,
          });
        }
    } finally {
        setIsChangingPassword(false);
    }
  };

  // ================= Eliminar cuenta =================
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!deletePasswordConfirm) {
      setMessage({ type: "error", text: "Debes confirmar tu contraseña" });
      return;
    }
    if (isDeletingAccount) return;

    setIsDeletingAccount(true);
    try {
      await deleteAccount(deletePasswordConfirm);
      // Después de eliminar la cuenta el listener de Auth limpia `user`.
      // Redirigimos a una pantalla pública.
      navigate("/login");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "No se pudo eliminar la cuenta",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mi Perfil</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* ============ Información personal ============ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </h2>
            <button
              onClick={() => {
                setEditingProfile(!editingProfile);
                if (!editingProfile) {
                  setProfileData({ name: user.name, phone: user.phone });
                  setProfileErrors({});
                }
                setMessage(null);
              }}
              disabled={isUpdatingProfile}
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {editingProfile ? (
                <>
                  <X className="w-4 h-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Editar
                </>
              )}
            </button>
          </div>

          {editingProfile ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  disabled={isUpdatingProfile}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                    profileErrors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                />
                {profileErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{profileErrors.name}</p>
                )}
              </div>

              {/* El email no se edita: lo gestiona Firebase Authentication. */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  El correo no se puede modificar desde aquí.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Celular
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  disabled={isUpdatingProfile}
                  placeholder="3001234567"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                    profileErrors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                />
                {profileErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{profileErrors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nombre
                </label>
                <p className="text-slate-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-slate-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Celular
                </label>
                <p className="text-slate-900">{user.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* ============ Cambiar contraseña ============ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Cambiar Contraseña
            </h2>
            <button
              onClick={() => {
                setShowChangePassword(!showChangePassword);
                setPasswordData({ current: "", new: "", confirm: "" });
                setPasswordErrors({});
                setMessage(null);
              }}
              disabled={isChangingPassword}
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold disabled:opacity-50"
            >
              {showChangePassword ? "Cancelar" : "Cambiar"}
            </button>
          </div>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, current: e.target.value })
                  }
                  disabled={isChangingPassword}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                    passwordErrors.current
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                />
                {passwordErrors.current && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.current}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, new: e.target.value })
                  }
                  disabled={isChangingPassword}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                    passwordErrors.new
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                />
                {passwordErrors.new ? (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.new}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">
                    Mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirm: e.target.value })
                  }
                  disabled={isChangingPassword}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent disabled:bg-slate-50 ${
                    passwordErrors.confirm
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                />
                {passwordErrors.confirm && (
                  <p className="mt-1 text-xs text-red-600">{passwordErrors.confirm}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Contraseña"
                )}
              </button>
            </form>
          )}

          {!showChangePassword && (
            <p className="text-sm text-slate-600">
              Haz clic en "Cambiar" para actualizar tu contraseña
            </p>
          )}
        </div>

        {/* ============ Eliminar cuenta ============ */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Eliminar Cuenta
            </h2>
            <button
              onClick={() => {
                setShowDeleteAccount(!showDeleteAccount);
                setDeletePasswordConfirm("");
                setMessage(null);
              }}
              disabled={isDeletingAccount}
              className="text-sm text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
            >
              {showDeleteAccount ? "Cancelar" : "Eliminar"}
            </button>
          </div>

          {showDeleteAccount && (
            <form onSubmit={handleDeleteAccount} className="space-y-4" noValidate>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700 font-semibold mb-2">⚠️ Advertencia</p>
                <p className="text-sm text-red-600">
                  Esta acción es permanente y no se puede deshacer. Se eliminarán tus
                  credenciales y datos de perfil, y no podrás volver a iniciar sesión con
                  este correo.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirma tu contraseña para eliminar la cuenta
                </label>
                <input
                  type="password"
                  value={deletePasswordConfirm}
                  onChange={(e) => setDeletePasswordConfirm(e.target.value)}
                  disabled={isDeletingAccount}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={isDeletingAccount}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Confirmar Eliminación de Cuenta"
                )}
              </button>
            </form>
          )}

          {!showDeleteAccount && (
            <p className="text-sm text-slate-600">
              Una vez eliminada, tu cuenta no podrá ser recuperada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
