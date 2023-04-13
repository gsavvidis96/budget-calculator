import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Add, AddOutlined } from "@mui/icons-material";
import userBaseStore, { DialogComponents } from "../store/base";
import supabase, { Functions } from "../supabase";
import { useMount, useUpdateEffect } from "react-use";
import useBudgetStore, { filterMap } from "../store/budget";
import BudgetCard from "../components/BudgetCard";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Filters from "../components/Filters";

const Home = () => {
  const { setDialog } = userBaseStore();
  const { budgets, setBudgets, filter } = useBudgetStore();
  const [loader, setLoader] = useState(false);
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));

  const fetchBudgets = useCallback(async () => {
    setLoader(true);

    const { data } = await supabase.rpc<
      "get_budgets_with_balance",
      Functions["get_budgets_with_balance"]
    >("get_budgets_with_balance", { sort_by: filterMap[filter] });

    if (data) setBudgets(data);

    setLoader(false);
  }, [setBudgets, filter]);

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
        () => {
          fetchBudgets();
        }
      )
      .subscribe();

    return () => {
      (async () => {
        await supabase.removeChannel(channel);
      })();
    };
  }, [fetchBudgets]);

  useUpdateEffect(() => {
    fetchBudgets();
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
        </Stack>
      )}
    </Stack>
  );
};

export default Home;
