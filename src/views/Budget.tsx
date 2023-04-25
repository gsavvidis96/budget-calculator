import { useParams } from "react-router-dom";
import { useMount } from "react-use";
import supabase from "../supabase";
import { useState } from "react";
import {
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PlaylistAdd } from "@mui/icons-material";

const Budget = () => {
  const { id } = useParams();
  const [currentBudget, setCurrentBudget] = useState<any>(null);
  const [loader, setLoader] = useState(true);
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));

  const getBudget = async () => {
    setLoader(true);

    const { data } = await supabase
      .from("budgets")
      .select()
      .eq("id", id)
      .single();

    setCurrentBudget(data);

    setLoader(false);
  };

  useMount(() => {
    getBudget();
  });

  return (
    <>
      {loader ? (
        <CircularProgress sx={{ m: "auto" }} size="75px" thickness={2} />
      ) : (
        <Stack
          sx={{
            flexGrow: 1,
          }}
          gap={2}
        >
          <Stack
            sx={{
              padding: 3,
              borderRadius: "4px",
              backgroundColor: "budgetCardBg.light",
              border: "1px solid",
              borderColor: "budgetCardBorder.main",
            }}
            gap={1}
          >
            <Typography
              sx={{ alignSelf: "center", textAlign: "center" }}
              variant="body1"
            >
              {currentBudget.title}
            </Typography>

            <Typography
              variant="h4"
              sx={{ alignSelf: "center", textAlign: "center" }}
            >
              0.00 €
            </Typography>

            <Stack
              direction="row"
              sx={{
                backgroundColor: "primary.light",
                padding: 1,
                borderRadius: "4px",
                width: smAndDown ? "100%" : "350px",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ alignSelf: "center", textAlign: "center", mr: "auto" }}
              >
                INCOME
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  alignSelf: "center",
                  textAlign: "center",
                  color: "white",
                  fontWeight: 500,
                }}
              >
                + 0.00
              </Typography>
            </Stack>

            <Stack
              direction="row"
              sx={{
                backgroundColor: "error.light",
                padding: 1,
                borderRadius: "4px",
                width: smAndDown ? "100%" : "350px",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ alignSelf: "center", textAlign: "center", mr: "auto" }}
              >
                EXPENSES
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  alignSelf: "center",
                  textAlign: "center",
                  color: "white",
                  fontWeight: 500,
                }}
              >
                - 0.00
              </Typography>
            </Stack>
          </Stack>

          <Stack
            gap={4}
            sx={{
              border: "1px solid",
              borderColor: "budgetCardBorder.main",
              borderRadius: "4px",
              padding: 2,
            }}
            direction={mdAndDown ? "column" : "row"}
          >
            <Stack gap={1} sx={{ flex: 1 }}>
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "center" }}
                gap={1}
              >
                <Typography
                  sx={{
                    alignSelf: "center",
                    textAlign: "center",
                    color: "primary.main",
                    fontWeight: 400,
                  }}
                  variant="h6"
                >
                  Income
                </Typography>

                <IconButton
                  sx={{
                    alignSelf: "center",
                    backgroundColor: "primary.main",
                    width: "24px",
                    height: "24px",
                  }}
                >
                  <PlaylistAdd sx={{ color: "white", fontSize: "20px" }} />
                </IconButton>
              </Stack>

              <Divider />
            </Stack>

            <Stack sx={{ flex: 1 }} gap={1}>
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "center" }}
                gap={1}
              >
                <Typography
                  sx={{
                    alignSelf: "center",
                    textAlign: "center",
                    color: "error.light",
                    fontWeight: 400,
                  }}
                  variant="h6"
                >
                  Expenses
                </Typography>

                <IconButton
                  sx={{
                    alignSelf: "center",
                    backgroundColor: "error.light",
                    width: "24px",
                    height: "24px",
                  }}
                >
                  <PlaylistAdd sx={{ color: "white", fontSize: "20px" }} />
                </IconButton>
              </Stack>

              <Divider />
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Budget;
