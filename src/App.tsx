import {
  Container,
  CssBaseline,
  Dialog,
  Drawer,
  Stack,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import supabase from "./supabase";
import useAuthStore from "./store/auth";
import userBaseStore, { DialogComponents } from "./store/base";
import createCustomTheme from "./theme";
import { useMemo } from "react";
import { useMount } from "react-use";
import NewBudget from "./views/NewBudget";
import DeleteBudget from "./views/DeleteBudget";
import Sidebar from "./components/Sidebar";
import Logout from "./views/Logout";

const App = () => {
  const [init, setInit] = useState(false);
  const { setUser } = useAuthStore();
  const {
    prefersDarkMode,
    togglePrefersDarkMode,
    dialog,
    setDialog,
    menu,
    setMenu,
  } = userBaseStore();

  const theme = useMemo(() => {
    return createCustomTheme(prefersDarkMode);
  }, [prefersDarkMode]);

  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));

  useMount(() => {
    const prefersDarkModeLocalStorage = JSON.parse(
      localStorage.getItem("prefersDarkMode")!
    ); // get prefered mode from local storage

    if (prefersDarkModeLocalStorage === null) {
      // if prefered mode is not set
      const isSystemDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme:dark)").matches; // check if system mode is dark mode;

      togglePrefersDarkMode(isSystemDarkMode); // set theme mode without setting local storage.
    } else {
      togglePrefersDarkMode(prefersDarkModeLocalStorage); // else set the mode from local storage
    }
  });

  useMount(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session)
        setUser({
          id: data.session.user!.id,
          email: data.session.user!.email!,
        });

      setInit(true);
    })();
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Stack sx={{ height: "100vh" }}>
        <Navbar />

        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            padding: "20px",
            display: "flex",
            flexDirection: " column",
          }}
        >
          {init ? <Outlet /> : <>loading</>}
        </Container>

        <Drawer open={menu} onClose={() => setMenu(!menu)} anchor="right">
          <Sidebar />
        </Drawer>

        <Dialog
          onClose={() => setDialog({ open: false, component: null })}
          open={dialog.open}
          fullWidth={mdAndDown}
          maxWidth={false}
        >
          <Stack sx={{ width: mdAndDown ? "100%" : "600px", padding: 2 }}>
            {dialog.component === DialogComponents.LOGOUT && <Logout />}

            {dialog.component === DialogComponents.NEW_BUDGET && <NewBudget />}

            {dialog.component === DialogComponents.DELETE_BUDGET && (
              <DeleteBudget {...dialog.props} />
            )}
          </Stack>
        </Dialog>
      </Stack>
    </ThemeProvider>
  );
};

export default App;
