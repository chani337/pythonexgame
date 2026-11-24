import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Catch the browser's install prompt as early as possible (see installApp.ts).
import './utils/installApp'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
