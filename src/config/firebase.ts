// Configuración centralizada de Firebase.
// Inicializa el SDK una sola vez y expone las instancias de Auth y Firestore
// para que las consuman los servicios (authService, userService).
//
// Los valores sensibles se leen desde variables de entorno (.env). En Vite
// deben estar prefijadas con VITE_ para que queden disponibles en el cliente.

import { initializeApp, getApps, getApp} from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Evita inicializar la app dos veces en hot-reload.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
