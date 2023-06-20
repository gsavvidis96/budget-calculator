import { Button, Stack, Typography } from "@mui/material";
import supabase from "../supabase";
import GoogleIcon from "../components/GoogleIcon";

const Login = () => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options:{
        redirectTo: window.location.origin
      }
    });

    if (error) return;
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
        alignItems: "center",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        Welcome to Budget Calculator
      </Typography>

      <Typography sx={{ marginBottom: 3 }}>
        In order to use the application, please sign in with your google
        account.
      </Typography>

      <Button
        onClick={handleLogin}
        sx={{ alignSelf: "center" }}
        variant="outlined"
        startIcon={<GoogleIcon fontSize="large" />}
        color="inherit"
      >
        Sign in with Google
      </Button>
    </Stack>
  );
};

export default Login;
