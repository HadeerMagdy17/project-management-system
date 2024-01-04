import { createContext, useState, ReactNode, useEffect } from "react";

export interface ITheme {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
  themeClass: string;
}
interface ThemeContextProviderProps {
  children: ReactNode;
}
export const ThemeContext = createContext<ITheme | null>(null);

const ThemeContextProvider: React.FC<ThemeContextProviderProps> = (props) => {
  // const [isDarkMode, setIsDarkMode] = useState(() => {

  //     const savedTheme =localStorage.getItem("isDarkMode");

  //     return savedTheme === 'true'; // Convert the stored string to a boolean
  // });

  // JSON.parse(localStorage.getItem("isDarkMode")) / convert string "true" or "false" to true and false
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => JSON.parse(localStorage.getItem("isDarkMode")) ?? true
  );

  const toggleTheme = () => {
    // setTheme((current)=> (current === 'light' ? 'dark' : 'light' ))
    setIsDarkMode((previousValue: boolean) => !previousValue);
  };
  useEffect(() => {
    // Save the theme preference to localStorage

    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);

  // isDarkMode variable  is used to condition the rendering according to the theme.
  const themeClass = isDarkMode ? "dark-theme" : "light-theme";

  const contextValue: ITheme = {
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
    themeClass,
  };
  return (
    <ThemeContext.Provider value={contextValue}>
      {props.children}
    </ThemeContext.Provider>
  );
};
export default ThemeContextProvider;
