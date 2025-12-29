import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { initAuthFetchInterceptor } from './utils/auth'

// initialize fetch interceptor to auto-redirect on token expiry / 401
initAuthFetchInterceptor();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
