import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ApolloClientSetup from "./Apollo/ApolloClientSetup.tsx";
import { AuthProvider } from "./navigation/AuthContext.tsx";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloClientSetup>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloClientSetup>
  </StrictMode>
);
