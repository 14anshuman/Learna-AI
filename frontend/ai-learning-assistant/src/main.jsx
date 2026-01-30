import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Toaster} from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx'
import PageWrapper from './PageWrapper.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PageWrapper>
      <Toaster position="top-right" toastOptions={{duration:3000}}/>
    <App />
    </PageWrapper>
    </AuthProvider>
  </StrictMode>,
)
