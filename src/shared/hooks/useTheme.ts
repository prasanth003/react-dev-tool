import { useContext } from "react";
import { ThemeContext } from "@/shared/context/ThemeContext";

export const useTheme = () => useContext(ThemeContext);