import { Info, Brightness7, Brightness4 } from "@mui/icons-material";
import {
  Dialog,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useBaseStore from "../store/base";
import useAuthStore from "../store/auth";
import { NavLink } from "react-router-dom";
import { useState, MouseEvent } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import Logout from "./Logout";

const Sidebar = () => {
  const { prefersDarkMode, togglePrefersDarkMode, setDrawer } = useBaseStore();
  const { user } = useAuthStore();
  const [dialog, setDialog] = useState(false);
  const theme = useTheme();
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));

  const openLogoutConfirmation = (event: MouseEvent) => {
    event.preventDefault();

    setDialog(true);

    setDrawer(false);
  };

  return (
    <>
      <Stack sx={{ width: "250px" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/about"
              onClick={() => setDrawer(false)}
              sx={{
                "&.active": {
                  color: theme.palette.primary.main,
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  ".MuiListItemIcon-root": {
                    color: `${theme.palette.primary.main}!important`,
                  },
                },
              }}
            >
              <ListItemIcon>
                <Info />
              </ListItemIcon>

              <ListItemText primary="About the project" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => togglePrefersDarkMode(!prefersDarkMode, true)}
            >
              <ListItemIcon>
                {theme.palette.mode === "dark" ? (
                  <Brightness7 />
                ) : (
                  <Brightness4 />
                )}
              </ListItemIcon>

              <ListItemText primary="Toggle dark mode" />
            </ListItemButton>
          </ListItem>

          {user && (
            <ListItem disablePadding>
              <ListItemButton onClick={openLogoutConfirmation}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>

                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Stack>

      <Dialog
        onClose={() => setDialog(false)}
        open={dialog}
        fullWidth={mdAndDown}
        maxWidth={false}
        sx={{
          ".MuiDialog-container .MuiPaper-root": {
            boxShadow: "none",
          },
        }}
      >
        <Stack
          sx={{ width: mdAndDown ? "100%" : "600px", padding: 2, flex: 1 }}
        >
          <Logout setDialog={setDialog} />
        </Stack>
      </Dialog>
    </>
  );
};

export default Sidebar;
