import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import useAuthStore from "../store/auth";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);

    navigate("/login");
  };

  return (
    <AppBar position="static">
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
            }}
          >
            React - Supa
          </Typography>

          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
