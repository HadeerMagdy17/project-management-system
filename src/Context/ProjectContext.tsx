
import axios from "axios";
import React, { useContext,createContext, ReactNode, useState , useEffect} from "react";
// import { ToastContext } from './ToastContext';
import { AuthContext } from "./AuthContext";


export interface ProjectContextType {
    getAllProjectsList: () => void;
    projects:{ title: string, description: string }[];
}
// Create the AuthContext and set the initial value to null
export const ProjectContext = createContext<ProjectContextType  | null>(null);

interface ProjectContextProviderProps {
    children: ReactNode;
  }

  export const ProjectContextProvider: React.FC<ProjectContextProviderProps> = (props) => {
    const { baseUrl, requestHeaders }: any = useContext(AuthContext);
    // const { getToastValue }: any = useContext(ToastContext);
    const [projects, setProjects] = useState<{ title: string; description: string }[]>([]);
    console.log(projects, "from projectContext");
    const [isLoading, setIsLoading] = useState(false);

    const getAllProjectsList = () => {
        setIsLoading(true);
        axios
          .get(`${baseUrl}/Project/manager`, { headers: requestHeaders })
          .then((response) => {
            setIsLoading(false);
            console.log(response?.data[0].title);
            setProjects(response?.data);
          })
          .catch((error) => {
            setIsLoading(false);
            // getToastValue(
            //   "error",
            //   error?.response?.data?.message ||
            //     "An error occurred. Please try again."
            // );
          });
      };

      useEffect(() => {
        getAllProjectsList();
      }, [])

    // Value to be provided by the context
  const contextValue: ProjectContextType = {
    getAllProjectsList,
    projects,
  }

    return <ProjectContext.Provider value={contextValue}>
        {props.children}
        </ProjectContext.Provider>;
  }
