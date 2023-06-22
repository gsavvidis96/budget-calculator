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
import { useDebounce, useMount, useUpdateEffect } from "react-use";
import useBudgetStore from "../../store/budget";
import BudgetCard from "./BudgetCard";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Filters from "./Filters";
import NewBudget from "./NewBudget";

const Home = () => {
  const { budgets, filter, budgetsFetched, fetchBudgets, search, setSearch } =
    useBudgetStore();
  const [loader, setLoader] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));

  const onFetchBudgets = async ({
    refresh = false,
    withLoader = true,
  } = {}) => {
    if (withLoader) setLoader(true);

    await fetchBudgets({ refresh });

    setLoader(false);
  };

  const [, cancel] = useDebounce(
    () => {
      setDebouncedSearch(search);
      onFetchBudgets({ refresh: true });
    },
    500,
    [search]
  );

  useMount(() => {
    cancel();

    onFetchBudgets();
  });

  useUpdateEffect(() => {
    onFetchBudgets({ refresh: true });
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
            <>
              {debouncedSearch ? (
                <Alert severity="warning">
                  <strong>No budgets found</strong>
                </Alert>
              ) : (
                <Alert severity="info">
                  <strong>You have no budgets yet</strong>
                </Alert>
              )}
            </>
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
