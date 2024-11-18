import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ApolloClientSetup from "./Apollo/ApolloClientSetup.tsx";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloClientSetup>
      <App />
    </ApolloClientSetup>
  </StrictMode>
);
