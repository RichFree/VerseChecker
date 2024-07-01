import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import App from './VerseSampler.jsx'
// import App from './MultiCheckbox.jsx'
// import Widget from './ReactCheckboxTree.jsx'
// import i18n (needs to be bundled ;))
import './i18n';

import './index.css'
import "@fontsource/montserrat"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
