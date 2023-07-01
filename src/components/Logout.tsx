import { Button, Stack, Typography } from "@mui/material";
import useAuthStore from "../store/auth";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import useBudgetStore from "../store/budget";

const Logout = ({ setDialog }: { setDialog: (dialog: boolean) => void }) => {
  const [loader, setLoader] = useState(false);
  const { setUser } = useAuthStore();
  const { reset } = useBudgetStore();
  const navigate = useNavigate();

  const closeDialog = () => {
    setDialog(false);
  };

  const handleLogout = async () => {
    setLoader(true);

    await supabase.auth.signOut();

    setUser(null);
    reset();

    navigate("/login");

    closeDialog();

    setLoader(false);
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

        <LoadingButton
          size="small"
          color="primary"
          variant="contained"
          onClick={handleLogout}
          loading={loader}
        >
          Logout
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default Logout;
