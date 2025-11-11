import { ThemeContext } from "@/shared/context/ThemeContext";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: Props) => {

    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;