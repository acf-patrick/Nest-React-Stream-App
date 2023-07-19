import { ThemeProvider } from "styled-components";
import themes from "./styles/themes";
import ThemeContext from "./contexts/theme";
import { useState } from "react";
import router from "./router";
import { RouterProvider } from "react-router-dom";

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
        <RouterProvider router={router} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
