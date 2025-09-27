import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";
import { lightTheme, darkTheme } from "../theme";

export type ThemeName = "light" | "dark";

interface ThemeContextProps {
  themeName: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  themeName: "light",
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [themeName, setThemeName] = useState<ThemeName>("dark");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // ✅ Debounce para evitar múltiplas trocas muito rápidas
  const toggleTheme = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setThemeName((prev) => (prev === "light" ? "dark" : "light"));
    }, 100); // 100ms de debounce
  }, []);

  const theme = themeName === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
