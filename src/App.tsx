import {
  Alert,
  Container,
  CssBaseline,
  Dialog,
  Drawer,
  Snackbar,
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
import Sidebar from "./components/Sidebar";
import Logout from "./components/Logout";
import NewBudgetItem from "./views/budget/NewBudgetItem";

const App = () => {
  const [init, setInit] = useState(false);
  const { setUser } = useAuthStore();
  const {
    prefersDarkMode,
    togglePrefersDarkMode,
    dialog,
    setDialog,
    drawer,
    setDrawer,
    snackbar,
    setSnackbar,
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

  useMount(async () => {
    // Remove the hash from the URL... supabase provider login adds it...
    if (window.location.hash && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.href.split("#")[0]);
    }

    const { data } = await supabase.auth.getSession();

    if (data.session)
      setUser({
        id: data.session.user!.id,
        email: data.session.user!.email!,
      });

    setInit(true);
  });

  const handleSnackbarClose = () => {
    setSnackbar({
      open: false,
    });
  };

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

        <Drawer open={drawer} onClose={() => setDrawer(!drawer)} anchor="right">
          <Sidebar />
        </Drawer>

        <Dialog
          onClose={() => setDialog({ open: false })}
          open={dialog.open}
          fullWidth={mdAndDown}
          maxWidth={false}
          sx={{
            ".MuiDialog-container .MuiPaper-root": {
              boxShadow: "none",
            },
          }}
          fullScreen
        >
          <Stack sx={{ width: mdAndDown ? "100%" : "600px", padding: 2 }}>
            {dialog.component === DialogComponents.LOGOUT && <Logout />}

            {dialog.component === DialogComponents.NEW_BUDGET_ITEM && (
              <NewBudgetItem {...dialog.props} />
            )}
          </Stack>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.type}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </ThemeProvider>
  );
};

export default App;
