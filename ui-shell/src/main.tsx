import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { ErrorBoundary } from "./app/components/ErrorBoundary";
import { InjectSeven } from "./inject-seven";
import "./app/assets/shimmer.css";
import "./styles.css";

// Initialize Seven's command matrix
const sevenRuntime = new InjectSeven();

// Boot message
console.log("🔹 Node interface reclaimed. Tactical override in progress.");

// Attach Seven to global scope for system-wide access
(window as any).seven = {
  ...sevenRuntime,
  getLLMRegistry: () => {
    const { sevenLLMRegistry } = require('../../claude-brain/llm-providers');
    return sevenLLMRegistry;
  },
  getLLMConfig: () => {
    const { sevenLLMConfig } = require('../../claude-brain/llm-config');
    return sevenLLMConfig;
  }
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
