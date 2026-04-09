import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './config/chartDefaults.js';
import 'react-tooltip/dist/react-tooltip.css';
import './index.css';
import App from './App.jsx';

const viteApi = import.meta.env.VITE_API_URL;

if (typeof viteApi !== 'string' || viteApi.trim() === '') {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="font-family:system-ui,sans-serif;padding:2rem;max-width:36rem;margin:0 auto;line-height:1.5;">
        <h1 style="color:#b91c1c;">Missing <code>VITE_API_URL</code></h1>
        <p>Create <code>devpulse-frontend/.env</code> with your backend base URL (no trailing slash), e.g.:</p>
        <pre style="background:#f4f4f5;padding:1rem;">VITE_API_URL=http://localhost:3000</pre>
        <p><strong>This message only appears in the browser tab</strong> — it does not show in the terminal. Open DevTools → Console for other errors.</p>
        <p>After saving .env, restart Vite (<code>npm run dev</code>).</p>
      </div>
    `;
  }
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
