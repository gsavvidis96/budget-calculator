import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    budgetCardBg: Palette["primary"];
    budgetCardHover: Palette["primary"];
    budgetCardBorder: Palette["primary"];
  }

  interface PaletteOptions {
    budgetCardBg?: PaletteOptions["primary"];
    budgetCardHover: PaletteOptions["primary"];
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
              main: "#e57373",
              contrastText: "#ffffff",
            },
            budgetCardBg: {
              main: "#212121",
              light: "#424242",
            },
            budgetCardHover: {
              main: "#424242",
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
              main: "#e57373",
              contrastText: "#ffffff",
            },
            budgetCardBg: {
              main: "#fafafa",
              light: "#fafafa",
            },
            budgetCardHover: {
              main: "#eeeeee",
            },
            budgetCardBorder: {
              main: "#eeeeee",
            },
          }),
    },
  });
};

export default createCustomTheme;
