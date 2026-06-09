import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AnimatedBackground from "./components/AnimatedBackground";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AnimatedBackground />
    <div className="app-content-layer">
      <App />
    </div>
  </StrictMode>,
);
