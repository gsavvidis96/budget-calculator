import { useParams } from "react-router-dom";
import { useMount } from "react-use";
import supabase, { Enums } from "../../supabase";
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
import BudgetSummary from "./BudgetSummary";
import userBaseStore, { DialogComponents } from "../../store/base";

const Budget = () => {
  const { id } = useParams();
  const [currentBudget, setCurrentBudget] = useState<any>(null);
  const [loader, setLoader] = useState(true);
  const theme = useTheme();
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));
  const { setDialog } = userBaseStore();

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

  const openDialog = (type: Enums["budget_item_type"]) => {
    setDialog({
      open: true,
      component: DialogComponents.NEW_BUDGET_ITEM,
      props: {
        type,
      },
    });
  };

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
          <BudgetSummary {...currentBudget} />

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
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                  onClick={() => openDialog("INCOME")}
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
                    fontWeight: 400,
                  }}
                  color="secondary"
                  variant="h6"
                >
                  Expenses
                </Typography>

                <IconButton
                  sx={{
                    alignSelf: "center",
                    backgroundColor: "secondary.main",
                    width: "24px",
                    height: "24px",
                    "&:hover": {
                      backgroundColor: "secondary.main",
                    },
                  }}
                  onClick={() => openDialog("EXPENSES")}
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
