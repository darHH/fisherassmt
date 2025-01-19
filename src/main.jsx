import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DatePicker from './DatePicker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="flex flex-col items-center pt-20">
      <App />
      <DatePicker />
    </div>
  </StrictMode>,
)
