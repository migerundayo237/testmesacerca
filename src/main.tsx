// Punto de entrada de la aplicación.
// Este archivo es el que monta el componente <App /> en el DOM.
// El proyecto anterior no lo tenía, por eso se veía pantalla en blanco:
// index.html apuntaba a /src/app.tsx pero nunca nadie llamaba a createRoot().

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("No se encontró el elemento #root en index.html");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
