import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { AddOutlined, ImportExport } from "@mui/icons-material";
import userBaseStore, { DialogComponents } from "../store/base";
import supabase, { Budgets, Functions } from "../supabase";
import { useMount } from "react-use";
import useBudgetStore from "../store/budget";
import BudgetCard from "../components/BudgetCard";
import { useCallback, useEffect, useState } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const Home = () => {
  const { setDialog } = userBaseStore();
  const { budgets, setBudgets } = useBudgetStore();
  const [loader, setLoader] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setLoader(true);

    const { data } = await supabase.rpc<
      "get_budgets_with_balance",
      Functions["get_budgets_with_balance"]
    >("get_budgets_with_balance");

    if (data) setBudgets(data);

    setLoader(false);
  }, [setBudgets]);

  // fetch budgets
  useMount(() => {
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
        (payload: RealtimePostgresChangesPayload<Budgets["Row"]>) => {
          if (payload.eventType === "INSERT") {
            fetchBudgets();
          }
        }
      )
      .subscribe();

    return () => {
      (async () => {
        await supabase.removeChannel(channel);
      })();
    };
  }, [fetchBudgets]);

  return (
    <Stack
      sx={{
        flexGrow: 1,
      }}
      gap={2}
    >
      <Stack
        sx={{
          padding: 4,
          borderRadius: "4px",
          backgroundColor: "budgetCardBg.light",
        }}
        direction="row"
        gap={3}
      >
        <TextField
          label="Search by name"
          variant="outlined"
          sx={{ width: "400px" }}
          color="secondary"
        />

        <Button
          sx={{ alignSelf: "center" }}
          endIcon={<ImportExport />}
          variant="text"
          color="inherit"
        >
          Sort By
        </Button>

        <Button
          variant="contained"
          color="primary"
          sx={{ ml: "auto", alignSelf: "center" }}
          startIcon={<AddOutlined />}
          onClick={() =>
            setDialog({ open: true, component: DialogComponents.NEW_BUDGET })
          }
        >
          New
        </Button>
      </Stack>

      {loader ? (
        <CircularProgress sx={{ m: "auto" }} size="75px" thickness={2} />
      ) : (
        <Stack gap={2} sx={{ flexGrow: 1, overflow: "auto" }}>
          {budgets.map((budget) => {
            return <BudgetCard {...budget} key={budget.id} />;
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default Home;
