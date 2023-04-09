import { Button, Stack, Typography } from "@mui/material";
import useBaseStore from "../store/base";
import useAuthStore from "../store/auth";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setDialog } = useBaseStore();
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const closeDialog = () => {
    setDialog({ open: false, component: null });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);

    navigate("/login");

    closeDialog();
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
        alignItems: "center",
      }}
      gap={2}
    >
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        Logout from Budget Calculator?
      </Typography>

      <Stack direction="row" gap={1}>
        <Button size="small" onClick={closeDialog}>
          Cancel
        </Button>

        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Stack>
    </Stack>
  );
};

export default Logout;
