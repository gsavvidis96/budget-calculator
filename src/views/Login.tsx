import { Button, Stack } from "@mui/material";
import supabase from "../supabase";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "gsavvidis96@gmail.com",
      password: "123123",
    });

    if (error) return;

    setUser({
      id: data!.user!.id,
      email: data!.user!.email!,
    });

    navigate("/");
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
      }}
    >
      <Button
        onClick={handleLogin}
        sx={{ alignSelf: "center" }}
        variant="contained"
      >
        login
      </Button>
    </Stack>
  );
};

export default Login;
