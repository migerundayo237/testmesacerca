// Contexto global de autenticación.
// - Se suscribe a onAuthStateChanged para mantener la sesión sincronizada con Firebase.
// - Carga el perfil de Firestore cuando hay un usuario autenticado.
// - Expone funciones asíncronas que delegan en los servicios (authService, userService).
// - Los componentes visuales solo consumen este contexto; no tocan el SDK de Firebase.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  ReactNode
} from "react";
import {
  registerWithEmailPassword,
  loginWithEmailPassword,
  logoutUser,
  sendResetPasswordEmail,
  reauthenticateCurrentUser,
  updateUserPassword,
  deleteCurrentUser,
  subscribeToAuthChanges,
  mapFirebaseAuthError,
} from "../services/authService";
import type {
  FirebaseUser
} from "../services/authService";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../services/userService";
import type {
  UserProfile
} from "../services/userService";

// Vista del usuario que usa el resto de la app. Combina datos de Auth y de Firestore.
export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: AuthUser | null;
  /** true mientras se resuelve el estado inicial de autenticación. Útil para Splash / ProtectedRoute. */
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;

  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (name: string, phone: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Convierte un Firebase user + perfil de Firestore en el shape que consume la UI. */
function toAuthUser(fb: FirebaseUser, profile: UserProfile | null): AuthUser {
  return {
    uid: fb.uid,
    name: profile?.nombre ?? fb.displayName ?? "",
    email: profile?.correo ?? fb.email ?? "",
    phone: profile?.celular ?? "",
  };
}

/**
 * Envuelve una llamada al SDK y re-lanza con un mensaje funcional.
 * Los componentes capturan este error y lo muestran al usuario.
 */
function rethrowMapped(err: unknown): never {
  const code = (err as { code?: string })?.code ?? "";
  const message = code
    ? mapFirebaseAuthError(code)
    : (err as Error)?.message ?? "Error inesperado";
  throw new Error(message);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listener central de Firebase. Se ejecuta al montar y en cada cambio de sesión.
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          setUser(toAuthUser(fbUser, profile));
        } catch {
          // Si falla la lectura del perfil igual dejamos la sesión con los datos de Auth.
          setUser(toAuthUser(fbUser, null));
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await loginWithEmailPassword(email.trim(), password);
      // El listener de onAuthStateChanged se encarga de actualizar `user`.
    } catch (err) {
      rethrowMapped(err);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      try {
        const fbUser = await registerWithEmailPassword(email.trim(), password);
        // Persistencia en Firestore justo después de crear la cuenta.
        await createUserProfile(fbUser.uid, {
          nombre: name.trim(),
          correo: email.trim(),
          celular: phone.trim(),
        });
      } catch (err) {
        rethrowMapped(err);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      rethrowMapped(err);
    }
  }, []);

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        await reauthenticateCurrentUser(currentPassword);
        await updateUserPassword(newPassword);
      } catch (err) {
        rethrowMapped(err);
      }
    },
    [],
  );

  const updateProfileFn = useCallback(
    async (name: string, phone: string) => {
      if (!user) throw new Error("No hay usuario autenticado.");
      try {
        await updateUserProfile(user.uid, {
          nombre: name.trim(),
          celular: phone.trim(),
        });
        setUser({ ...user, name: name.trim(), phone: phone.trim() });
      } catch (err) {
        rethrowMapped(err);
      }
    },
    [user],
  );

  const deleteAccount = useCallback(
    async (password: string) => {
      if (!user) throw new Error("No hay usuario autenticado.");
      try {
        await reauthenticateCurrentUser(password);
        // Primero borramos el doc de Firestore; luego la cuenta de Auth.
        await deleteUserProfile(user.uid);
        await deleteCurrentUser();
      } catch (err) {
        rethrowMapped(err);
      }
    },
    [user],
  );

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendResetPasswordEmail(email.trim());
    } catch (err) {
      rethrowMapped(err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updatePassword,
        updateProfile: updateProfileFn,
        deleteAccount,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
