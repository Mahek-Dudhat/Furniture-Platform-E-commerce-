import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import FurnitureProductsProvider from './context/FurnitureProductsProvider'
import AuthContext from './context/AuthContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <AuthContext>
        <FurnitureProductsProvider>
          <App />
        </FurnitureProductsProvider>
      </AuthContext>
    </ErrorBoundary>
  )
}
