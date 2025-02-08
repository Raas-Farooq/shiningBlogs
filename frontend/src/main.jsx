import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UIContextProvider, AuthenContextProvider, BlogContextProvider } from './globalContext/globalContext.tsx'
import AppRoutes from './Routes/appRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <AuthenContextProvider>
    <UIContextProvider>
      <BlogContextProvider>
        <AppRoutes>
          <App />
        </AppRoutes>
      </BlogContextProvider>
    </UIContextProvider>
  </AuthenContextProvider>,
)
