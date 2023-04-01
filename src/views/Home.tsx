import { Stack } from "@mui/material";
import useAuthStore from "../store/auth";
import { useEffect } from "react";

const Home = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Stack
      sx={{
        flexGrow: 1,
      }}
    >
      Home
    </Stack>
  );
};

export default Home;
