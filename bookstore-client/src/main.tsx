import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Loads Bootstrap so we can use utility classes and table/button styles.
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
