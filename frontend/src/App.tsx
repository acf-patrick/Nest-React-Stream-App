import { ThemeProvider } from "styled-components";
import themes from "./styles/themes";
import ThemeContext from "./contexts/theme";
import { useState } from "react";

function App() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme() {
          setTheme((theme) => (theme === "light" ? "dark" : "light"));
        },
      }}
    >
      <ThemeProvider theme={theme === "light" ? themes.light : themes.dark}>
        hello world
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
