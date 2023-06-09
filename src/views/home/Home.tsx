import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Add, AddOutlined, Close } from "@mui/icons-material";
import supabase, { Functions } from "../../supabase";
import { useDebounce, useMount, useUpdateEffect } from "react-use";
import useBudgetStore, { filterMap } from "../../store/budget";
import BudgetCard from "./BudgetCard";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Filters from "./Filters";
import useBaseStore from "../../store/base";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Budgets } from "../../supabase";
import NewBudget from "./NewBudget";

const Home = () => {
  const { budgets, setBudgets, filter, budgetsFetched, setBudgetsFetched } =
    useBudgetStore();
  const { setSnackbar } = useBaseStore();
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(false);
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));

  const fetchBudgets = useCallback(
    async ({
      refresh = false,
      withLoader = true,
    }: {
      refresh?: boolean;
      withLoader?: boolean;
    } = {}) => {
      if (budgetsFetched && !refresh) return;

      if (withLoader) setLoader(true);

      const { data } = await supabase.rpc<
        "get_budgets_with_balance",
        Functions["get_budgets_with_balance"]
      >("get_budgets_with_balance", {
        sort_by: filterMap[filter],
        search_query: search,
      });

      if (data) setBudgets(data);

      setBudgetsFetched(true);

      setLoader(false);
    },
    [budgetsFetched, filter, search, setBudgets, setBudgetsFetched]
  );

  const [, cancel] = useDebounce(
    () => {
      fetchBudgets({ refresh: true });
    },
    500,
    [search]
  );

  useMount(() => {
    cancel();

    fetchBudgets();
  });

  // subscribe to budgets
  useEffect(() => {
    const channel = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "budgets",
        },
        (payload: RealtimePostgresChangesPayload<Budgets>) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE")
            fetchBudgets({ refresh: true });

          if (payload.eventType === "INSERT")
            setSnackbar({
              open: true,
              type: "success",
              message: "Budget was added!",
            });

          if (payload.eventType === "DELETE")
            setSnackbar({
              open: true,
              type: "warning",
              message: "Budget was deleted.",
            });

          if (payload.eventType === "UPDATE")
            setSnackbar({
              open: true,
              type: "success",
              message: "Budget was updated.",
            });
        }
      )
      .subscribe();

    return () => {
      (async () => {
        await supabase.removeChannel(channel);
      })();
    };
  }, [fetchBudgets, setSnackbar, search]);

  useUpdateEffect(() => {
    fetchBudgets({ refresh: true });
  }, [filter]);

  return (
    <Stack
      sx={{
        flexGrow: 1,
      }}
      gap={2}
    >
      <Stack
        sx={{
          padding: smAndDown ? 2 : 4,
          borderRadius: "4px",
          backgroundColor: "budgetCardBg.light",
        }}
        direction="row"
        gap={smAndDown ? 1 : 3}
      >
        <TextField
          label="Search by name"
          variant="outlined"
          sx={{
            width: mdAndDown ? "auto" : "400px",
            flexGrow: mdAndDown ? "1" : "0",
          }}
          color="primary"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {search && (
                  <IconButton onClick={() => setSearch("")} size="small">
                    <Close />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        <Filters />

        {smAndDown ? (
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
            size="small"
            color="primary"
            onClick={() => setDialog(true)}
          >
            <Add sx={{ color: "white", fontSize: "20px" }} />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: "auto", alignSelf: "center" }}
            startIcon={<AddOutlined />}
            size="small"
            onClick={() => setDialog(true)}
          >
            New
          </Button>
        )}
      </Stack>

      {loader ? (
        <CircularProgress sx={{ m: "auto" }} size="75px" thickness={2} />
      ) : (
        <Stack gap={2} sx={{ flexGrow: 1 }}>
          {budgets.map((budget) => {
            return <BudgetCard {...budget} key={budget.id} />;
          })}

          {budgetsFetched && budgets.length === 0 && (
            <Alert severity="info">
              <strong>You have no budgets yet</strong>
            </Alert>
          )}
        </Stack>
      )}

      <Dialog
        onClose={() => setDialog(false)}
        open={dialog}
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
          <NewBudget setDialog={setDialog} />
        </Stack>
      </Dialog>
    </Stack>
  );
};

export default Home;
