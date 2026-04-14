import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </AuthProvider>
  </StrictMode>
);
