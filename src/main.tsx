import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import './design/tokens.css'
import './design/themes.css'
import './design/bootstrap.scss'
import './design/motion.css'
import './design/app.scss'
import App from './app/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
