import React from 'react';
import ReactDOM from 'react-dom/client';


import App from './App.jsx'


const root = ReactDOM.createRoot(
  document.getElementById('root') ,
);

root.render(
  <React.StrictMode>
    <SsoAuth clientId="304531247476-58f940f3b0dgrupg95cdo8b51fspupdv.apps.googleusercontent.com">
    
        <App />

    </SsoAuth>
  </React.StrictMode>,
);
