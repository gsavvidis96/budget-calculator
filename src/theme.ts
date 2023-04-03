import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    budgetCardBg: Palette["primary"];
    budgetCardBorder: Palette["primary"];
  }

  interface PaletteOptions {
    budgetCardBg?: PaletteOptions["primary"];
    budgetCardBorder?: PaletteOptions["primary"];
  }
}

const createCustomTheme = (prefersDarkMode: boolean) => {
  return createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      ...(prefersDarkMode
        ? {
            // dark mode pallete
            primary: {
              main: "#26a69a",
            },
            secondary: {
              main: "#26a69a",
            },
            budgetCardBg: {
              main: "#212121",
              light: "#424242",
            },
            budgetCardBorder: {
              main: "#424242",
            },
          }
        : {
            // light mode pallete
            primary: {
              main: "#26a69a",
            },
            secondary: {
              main: "#26a69a",
            },
            budgetCardBg: {
              main: "#fafafa",
              light: "#fafafa",
            },
            budgetCardBorder: {
              main: "#eeeeee",
            },
          }),
    },
  });
};

export default createCustomTheme;
