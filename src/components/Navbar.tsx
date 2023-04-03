import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import useAuthStore from "../store/auth";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import useBaseStore from "../store/base";
import { Brightness7, Brightness4 } from "@mui/icons-material";

const Navbar = () => {
  const { user, setUser } = useAuthStore();
  const { prefersDarkMode, togglePrefersDarkMode } = useBaseStore();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);

    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid",
        borderColor: "budgetCardBorder.main",
      }}
    >
      <Toolbar>
        <Stack
          sx={{ flexGrow: 1, alignItems: "center" }}
          gap={1}
          direction="row"
        >
          <Typography
            variant="h6"
            sx={{
              color: "inherit",
              textDecoration: "none",
              mr: "auto",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            Budget Calculator
          </Typography>

          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}

          <IconButton
            color="primary"
            onClick={() => togglePrefersDarkMode(!prefersDarkMode, true)}
          >
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
