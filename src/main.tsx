import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { AuthContextProvider } from "./Context/AuthContext.tsx";
import ToastContextProvider from "./Context/ToastContext";
import { ProjectContextProvider } from './Context/ProjectContext';
import  ThemeContext  from './Context/ThemeContext.tsx';

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeContext>
    <AuthContextProvider>
       {/* <ProjectContextProvider> */}
      <ToastContextProvider>
        <App />
      </ToastContextProvider>
      {/* </ProjectContextProvider> */}
    </AuthContextProvider>
    </ThemeContext>
  // </React.StrictMode>
);





