import { createContext } from "react";
import type { ThemeContextType } from "@/shared/types";

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark'
});