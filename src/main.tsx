import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log errors to console in development
        if (import.meta.env.DEV) {
          console.error('[Widget Error]', error, errorInfo)
        }
        // In production, you could send to an error tracking service
        // e.g., Sentry.captureException(error)
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
