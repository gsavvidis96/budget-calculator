import { Button, Stack, TextField } from "@mui/material";
import { AddOutlined, ImportExport } from "@mui/icons-material";
import userBaseStore, { DialogComponents } from "../store/base";
import supabase from "../supabase";
import { useEffectOnce } from "react-use";
import useBudgetStore from "../store/budget";
import { Database } from "../db_types";
import BudgetCard from "../components/BudgetCard";
import { useEffect } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const Home = () => {
  const { setDialog } = userBaseStore();
  const { budgets, setBudgets } = useBudgetStore();

  // fetch budgets
  useEffectOnce(() => {
    (async () => {
      const { data } = await supabase
        .from<"budgets", Database["public"]["Tables"]["budgets"]>("budgets")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (data) setBudgets(data);
    })();
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
        (
          payload: RealtimePostgresChangesPayload<
            Database["public"]["Tables"]["budgets"]["Row"]
          >
        ) => {
          if (payload.eventType === "INSERT") {
            console.log([...budgets, { ...payload.new }]);

            setBudgets([...budgets, { ...payload.new }]);
          }
        }
      )
      .subscribe();

    return () => {
      (async () => {
        await supabase.removeChannel(channel);
      })();
    };
  }, [budgets, setBudgets]);

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

      <Stack gap={2} sx={{ flexGrow: 1, overflow: "auto" }}>
        {budgets.map((budget) => {
          return <BudgetCard {...budget} key={budget.id} />;
        })}
      </Stack>
    </Stack>
  );
};

export default Home;
