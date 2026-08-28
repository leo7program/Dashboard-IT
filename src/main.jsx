import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TicketProvider } from './context/TicketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TicketProvider>
      <App />
    </TicketProvider>
  </StrictMode>,
)
