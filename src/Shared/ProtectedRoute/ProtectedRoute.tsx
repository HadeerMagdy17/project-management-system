import React from 'react'
import { Navigate } from 'react-router-dom';


interface Props{
   userData :any ;
    children :React.ReactNode;
}

export default function ProtectedRoute({userData, children}:Props) {
    if (userData == null && localStorage.getItem("userToken")==null){
        return <Navigate to="/login"/>
    }else{
        return <>{children}</>
    }

}
