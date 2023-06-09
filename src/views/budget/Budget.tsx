import { useParams } from "react-router-dom";
import { useMount } from "react-use";
import supabase, { Enums, Functions } from "../../supabase";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
import BudgetItem from "./BudgetItem";
import NewBudgetItem from "./NewBudgetItem";

export interface newBudgetItemDialog {
  open: boolean;
  type?: Enums["budget_item_type"];
}

const Budget = () => {
  const { id } = useParams();
  const [currentBudget, setCurrentBudget] = useState<
    Functions["get_budget"]["Returns"] | null
  >(null);
  const [loader, setLoader] = useState(true);
  const theme = useTheme();
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const [dialog, setDialog] = useState<newBudgetItemDialog>({
    open: false,
    type: undefined,
  });

  const getBudget = useCallback(async () => {
    setLoader(true);

    const { data } = await supabase
      .rpc<"get_budget", Functions["get_budget"]>("get_budget", {
        b_id: id!,
      })
      .single();

    setCurrentBudget(data);

    setLoader(false);
  }, [id]);

  // subscribe to budgets
  useEffect(() => {
    const channel = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "budget_items",
        },
        () => {
          getBudget();
        }
      )
      .subscribe();

    return () => {
      (async () => {
        await supabase.removeChannel(channel);
      })();
    };
  }, [getBudget]);

  useMount(() => {
    getBudget();
  });

  const openDialog = (type: Enums["budget_item_type"]) => {
    setDialog({
      open: true,
      type,
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
          gap={4}
        >
          <BudgetSummary {...currentBudget!} />

          <Stack gap={5} direction={mdAndDown ? "column" : "row"}>
            <Stack gap={3} sx={{ flex: 1 }}>
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

              <Stack>
                <Divider />

                {currentBudget!.income_items.map((i) => {
                  return <BudgetItem {...i} key={i.id} />;
                })}

                {currentBudget!.income_items.length === 0 && (
                  <Stack
                    sx={{
                      py: 2,
                    }}
                  >
                    <Alert severity="info">
                      <strong>You have no income yet</strong>
                    </Alert>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Stack sx={{ flex: 1 }} gap={3}>
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

              <Stack>
                <Divider />

                {currentBudget!.expense_items.map((e) => {
                  return <BudgetItem {...e} key={e.id} />;
                })}

                {currentBudget!.expense_items.length === 0 && (
                  <Stack
                    sx={{
                      py: 2,
                    }}
                  >
                    <Alert severity="error">
                      <strong>You have no expenses yet</strong>
                    </Alert>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}

      <Dialog
        onClose={() => setDialog({ open: false })}
        open={dialog.open}
        fullWidth={mdAndDown}
        fullScreen={smAndDown}
        maxWidth={false}
        sx={{
          ".MuiDialog-container .MuiPaper-root": {
            boxShadow: "none",
          },
        }}
      >
        <Stack
          sx={{ width: mdAndDown ? "100%" : "600px", padding: 2, flex: 1 }}
        >
          {dialog.type && (
            <NewBudgetItem type={dialog.type} setDialog={setDialog} />
          )}
        </Stack>
      </Dialog>
    </>
  );
};

export default Budget;
