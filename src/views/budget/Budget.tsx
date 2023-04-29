import { useParams } from "react-router-dom";
import { useMount } from "react-use";
import supabase, { Enums } from "../../supabase";
import { useState } from "react";
import {
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PlaylistAdd } from "@mui/icons-material";
import BudgetSummary from "./BudgetSummary";
import NewBudgetItem from "./NewBudgetItem";

const Budget = () => {
  const { id } = useParams();
  const [currentBudget, setCurrentBudget] = useState<any>(null);
  const [loader, setLoader] = useState(true);
  const [dialog, setDialog] = useState<{
    open: boolean;
    type?: Enums["budget_item_type"];
  }>({
    open: false,
  });
  const theme = useTheme();

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

  const openDialog = (type: Enums["budget_item_type"]) => {
    setDialog({
      open: true,
      type,
    });
  };

  const closeDialog = () => {
    setDialog({
      open: false,
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
                    "&:hover": {
                      backgroundColor: "error.light",
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

          <Dialog
            onClose={closeDialog}
            open={dialog.open}
            fullWidth={mdAndDown}
            sx={{
              ".MuiDialog-container .MuiPaper-root": {
                boxShadow: "none",
              },
            }}
          >
            <Stack sx={{ width: mdAndDown ? "100%" : "600px", padding: 2 }}>
              <NewBudgetItem type={dialog.type!} />
            </Stack>
          </Dialog>
        </Stack>
      )}
    </>
  );
};

export default Budget;
