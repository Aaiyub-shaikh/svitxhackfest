import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// #region agent log
fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:7',message:'main.tsx execution started',data:{timestamp:Date.now(),userAgent:navigator.userAgent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

const rootElement = document.getElementById("root");

// #region agent log
fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:12',message:'root element check',data:{rootExists:!!rootElement,rootId:rootElement?.id,bodyChildren:document.body.children.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

if (!rootElement) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:17',message:'ERROR: root element not found',data:{documentReady:document.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  throw new Error("Root element not found");
}

try {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:24',message:'attempting React render',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  const root = createRoot(rootElement);
  root.render(<App />);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:29',message:'React render completed successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
} catch (error) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4851355a-993a-4a63-a581-a0e249f20adf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:33',message:'ERROR: React render failed',data:{errorMessage:error instanceof Error ? error.message : String(error),errorStack:error instanceof Error ? error.stack : undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  throw error;
}
