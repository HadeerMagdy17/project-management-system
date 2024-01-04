
import { createContext,ReactNode } from 'react';
import { toast } from 'react-toastify';

export interface ToastContextType{
    getToastValue: (type: ToastType, message: string) => void;
}
interface ToastContextProviderProps {
    children: ReactNode;
}
type ToastType = "success" | "error" | "info" | "warning";
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastContextProvider: React.FC<ToastContextProviderProps> = (props)=>{

    
    const getToastValue =(type: ToastType, message: string)=>{
        return toast[type](message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })
    }
    
    return(
    <ToastContext.Provider value={{getToastValue}}>
        {props.children}
    </ToastContext.Provider>
    )
}

export default ToastContextProvider;