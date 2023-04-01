import { Stack } from "@mui/material";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./supabase";
import useAuthStore from "./store/auth";

const App = () => {
  const [init, setInit] = useState(false);
  const { setUser } = useAuthStore();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session)
        setUser({
          id: data.session.user!.id,
          email: data.session.user!.email!,
        });

      setInit(true);
    })();
  }, [setUser]);

  return (
    <Stack sx={{ height: "100vh" }}>
      <Navbar />

      <Stack
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        {init ? <Outlet /> : <>loading</>}
      </Stack>
    </Stack>
  );
};

export default App;
