import { ThemeProvider } from "styled-components";
import themes from "./styles/themes";
import ThemeContext from "./contexts/theme";
import { useState } from "react";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import GlobalStyles from "./styles/globalStyles";

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
      <ThemeProvider
        theme={{
          ...themes,
          colors: theme === "light" ? themes.colors.light : themes.colors.dark,
        }}
      >
        <GlobalStyles />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
