import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Add, AddOutlined, Close } from "@mui/icons-material";
import userBaseStore, { DialogComponents } from "../store/base";
import supabase, { Functions } from "../supabase";
import { useDebounce, useMount, useUpdateEffect } from "react-use";
import useBudgetStore, { filterMap } from "../store/budget";
import BudgetCard from "../components/BudgetCard";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Filters from "../components/Filters";
import useBaseStore from "../store/base";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Budgets } from "../supabase";

const Home = () => {
  const { setDialog } = userBaseStore();
  const { budgets, setBudgets, filter } = useBudgetStore();
  const { setSnackbar } = useBaseStore();
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));

  const fetchBudgets = useCallback(
    async (withLoader = true) => {
      if (withLoader) setLoader(true);

      const { data } = await supabase.rpc<
        "get_budgets_with_balance",
        Functions["get_budgets_with_balance"]
      >("get_budgets_with_balance", {
        sort_by: filterMap[filter],
        search_query: search,
      });

      if (data) setBudgets(data);

      if (withLoader) setLoader(false);
    },
    [setBudgets, filter, search]
  );

  const [, cancel] = useDebounce(
    () => {
      fetchBudgets();
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
          fetchBudgets(false);

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
  }, [fetchBudgets, setSnackbar]);

  useUpdateEffect(() => {
    fetchBudgets();
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
          color="secondary"
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
            }}
            size="small"
            color="primary"
            onClick={() =>
              setDialog({
                open: true,
                component: DialogComponents.NEW_BUDGET,
              })
            }
          >
            <Add sx={{ color: "white" }} />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: "auto", alignSelf: "center" }}
            startIcon={<AddOutlined />}
            onClick={() =>
              setDialog({
                open: true,
                component: DialogComponents.NEW_BUDGET,
              })
            }
          >
            New
          </Button>
        )}
      </Stack>

      {loader ? (
        <CircularProgress sx={{ m: "auto" }} size="75px" thickness={2} />
      ) : (
        <Stack gap={2} sx={{ flexGrow: 1, overflow: "auto" }}>
          {budgets.map((budget) => {
            return <BudgetCard {...budget} key={budget.id} />;
          })}

          {budgets.length === 0 && (
            <Typography variant="h4" sx={{ mt: 4 }}>
              No Budgets found.
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default Home;
