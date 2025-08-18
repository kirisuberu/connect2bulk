import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'

// Attempt to auto-configure Amplify using generated outputs if present
try {
  const modules = import.meta.glob('../amplify_outputs.json', { eager: true }) as Record<string, any>
  const mod = Object.values(modules)[0]
  if (mod) {
    const outputs = mod.default ?? mod
    Amplify.configure(outputs)
  }
} catch {
  // no-op if outputs are not available yet
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
