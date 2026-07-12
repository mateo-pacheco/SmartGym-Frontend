import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/poppins/latin-ext-400.css'
import '@fontsource/poppins/latin-ext-500.css'
import '@fontsource/poppins/latin-ext-600.css'
import '@fontsource/poppins/latin-ext-700.css'
import './design/tokens.css'
import './design/themes.css'
import './design/bootstrap.scss'
import './design/motion.css'
import './design/app.scss'
import App from './app/App'
import { StartupExperience } from './components/feedback/StartupExperience'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <StartupExperience>
        <App />
      </StartupExperience>
    </MotionConfig>
  </React.StrictMode>,
)
