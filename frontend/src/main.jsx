import { createRoot } from 'react-dom/client'
import './index.css';
import { UIContextProvider, AuthenContextProvider, BlogContextProvider } from './globalContext/globalContext.tsx'
import AppRoutes from './Routes/appRoutes.tsx'


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found in the DOM.");
}

const root = createRoot(rootElement);


root.render(
  <AuthenContextProvider>
    <UIContextProvider>
      <BlogContextProvider>
        <AppRoutes>
        </AppRoutes>
      </BlogContextProvider>
    </UIContextProvider>
  </AuthenContextProvider>,
)
