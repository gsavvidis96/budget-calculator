import { Info, Brightness7, Brightness4, Logout } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
} from "@mui/material";
import useBaseStore, { DialogComponents } from "../store/base";
import useAuthStore from "../store/auth";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { prefersDarkMode, togglePrefersDarkMode, setDialog, setDrawer } =
    useBaseStore();
  const { user } = useAuthStore();
  const theme = useTheme();

  const openLogoutConfirmation = () => {
    setDialog({
      open: true,
      component: DialogComponents.LOGOUT,
    });

    setDrawer(false);
  };

  return (
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
                <Logout />
              </ListItemIcon>

              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Stack>
  );
};

export default Sidebar;
