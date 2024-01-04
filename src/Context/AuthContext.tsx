import React, { createContext, ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Define the shape of your authentication data//
export interface IAuth {
  userData: string;
  saveUserData: () => void;
  requestHeaders: string;
  baseUrl: string;
  userRole: string;
  updateUserData: () => void;
}

// Create the AuthContext and set the initial value to null
export const AuthContext = createContext<IAuth>({
  userData: '', 
  saveUserData: () => {},
  requestHeaders: '',
  baseUrl: '',
  userRole: '',
  updateUserData: () => {},
});
 

// Define the props for AuthContextProvider component
interface AuthContextProviderProps {
  children: ReactNode;
}

// AuthContextProvider component that provides the AuthContext to its children
export const AuthContextProvider: React.FC<AuthContextProviderProps> = (props) => {
  const [userData, setUserData] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<any | null>(null);

  const updateUserData =(newUserData:string)=>{
    setUserData(newUserData);
  }
  // Save user data function
  const saveUserData = () => {
    const encodedToken = localStorage.getItem("userToken");
    const decodedToken = jwtDecode(encodedToken!);
    setUserData(decodedToken);
    setUserRole(decodedToken.userGroup)
  };

  // Compute request headers
  const requestHeaders = {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  };

  // On component mount, check for userToken and save data
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      saveUserData();
    }
  }, []);

  // Value to be provided by the context
  const contextValue: IAuth = {
    userData,
    saveUserData,
    requestHeaders,
    baseUrl: "http://upskilling-egypt.com:3003/api/v1",
    userRole,
    updateUserData
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};
