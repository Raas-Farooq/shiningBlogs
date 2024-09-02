import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GlobalState } from './globalContext/globalContext.jsx'
import AppRoutes from './Routes/appRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <GlobalState>
    <AppRoutes>
      <App />
    </AppRoutes>
  </GlobalState>,
)
