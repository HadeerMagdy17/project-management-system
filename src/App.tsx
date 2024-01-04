import { RouterProvider, createHashRouter } from "react-router-dom";
import AuthLayout from "./Shared/AuthLayout/AuthLayout";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import RequestReset from "./Components/RequestReset/RequestReset";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import VerifyUser from "./Components/VerifyUser/VerifyUser";
import Notfound from "./Shared/NotFound/Notfound";
import MasterLayout from "./Shared/MasterLayout/MasterLayout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Projects from "./Components/Projects/Projects";
import Users from "./Components/Users/Users";
import Tasks from "./Components/Tasks/Tasks";
import { useContext } from "react";
import { AuthContext, IAuth } from "./Context/AuthContext";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import ProtectedRoute from "./Shared/ProtectedRoute/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import AddProject from "./Components/AddProject/AddProject";
import AddTask from "./Components/AddTask/AddTask";
import "./App.css";
import { ThemeContext, ITheme } from './Context/ThemeContext';


function App() {
  const{ userData, saveUserData } :IAuth= useContext(AuthContext);
  const {isDarkMode, themeClass}:ITheme = useContext(ThemeContext);

  const routes = createHashRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <Notfound />,
      children: [
        { index: true, element: <Login saveUserData={saveUserData} /> },
        { path: "login", element: <Login saveUserData={saveUserData} /> },
        { path: "register", element: <Register /> },
        { path: "request-reset", element: <RequestReset /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "verify-user", element: <VerifyUser /> },
        { path: "notfound", element: <Notfound /> },
        { path: "change-password", element: <ChangePassword /> },
      ],
    },
    {
      path: "dashboard",

      element: (
        <ProtectedRoute userData={userData}>
          <MasterLayout userData={userData} />
        </ProtectedRoute>
      ),
      errorElement: <Notfound />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "projects", element: <Projects /> },
        { path: "projects/add-project", element: <AddProject /> },
        { path: "users", element: <Users /> },
        { path: "tasks", element: <Tasks /> },
        { path: "tasks/add-task", element: <AddTask /> },
      ],
    },
  ]);

  return (
    <>


      <div className={`app ${themeClass}`}>
      {/* <div className="app" id="light"> */}
      {/* <div className="app" id="dark"> */}
        <ToastContainer />
        <RouterProvider router={routes} />
      </div>
    </>
  );
}

export default App;
