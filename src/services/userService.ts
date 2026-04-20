// Servicio de usuarios: aísla la persistencia del perfil en Cloud Firestore.
// Cada documento se guarda en la colección "usuarios" usando el uid de Auth como ID.

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface UserProfile {
  uid: string;
  nombre: string;
  correo: string;
  celular: string;
  createdAt: Timestamp | null;
  estado: "activo" | "inactivo";
}

export interface UserProfileInput {
  nombre: string;
  correo: string;
  celular: string;
}

const COLLECTION = "usuarios";

/** Crea el documento del usuario al completar el registro. */
export async function createUserProfile(uid: string, data: UserProfileInput): Promise<void> {
  const ref = doc(db, COLLECTION, uid);
  await setDoc(ref, {
    uid,
    nombre: data.nombre,
    correo: data.correo,
    celular: data.celular,
    createdAt: serverTimestamp(),
    estado: "activo",
  });
}

/** Obtiene el perfil del usuario desde Firestore. */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

/**
 * Actualiza solo los campos editables del perfil (nombre, celular).
 * El correo no se edita desde aquí porque depende de Firebase Authentication.
 */
export async function updateUserProfile(
  uid: string,
  data: { nombre?: string; celular?: string },
): Promise<void> {
  const ref = doc(db, COLLECTION, uid);
  await updateDoc(ref, { ...data });
}

/** Elimina el documento del perfil al borrar la cuenta. */
export async function deleteUserProfile(uid: string): Promise<void> {
  const ref = doc(db, COLLECTION, uid);
  await deleteDoc(ref);
}
