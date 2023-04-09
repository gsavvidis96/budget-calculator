import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import useBaseStore from "../store/base";
import { Menu } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const { menu, setMenu } = useBaseStore();

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
            component={NavLink}
            to="/"
          >
            Budget Calculator
          </Typography>

          <IconButton color="primary" onClick={() => setMenu(!menu)}>
            <Menu></Menu>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
