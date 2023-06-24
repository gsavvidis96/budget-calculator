import {
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import supabase, { BudgetItems, Enums } from "../../supabase";
import { LoadingButton } from "@mui/lab";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useBudgetStore from "../../store/budget";
import { newBudgetItemDialog } from "./Budget";
import { Close } from "@mui/icons-material";
import useBaseStore from "../../store/base";

interface Props {
  type: Enums["budget_item_type"];
  setDialog: (dialog: newBudgetItemDialog) => void;
  budgetItem?: {
    id: string;
    description: string;
    value: number;
  };
}

const NewBudgetItem = ({
  type,
  setDialog,
  budgetItem = { id: "", description: "", value: 0 },
}: Props) => {
  const [description, setDescription] = useState(budgetItem.description);
  const [value, setValue] = useState(budgetItem.value);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const { setBudgetsFetched, fetchCurrentBudget } = useBudgetStore();
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const [initialValues] = useState({
    description: budgetItem.description,
    value: budgetItem.value,
  });
  const { setSnackbar } = useBaseStore();

  useEffect(() => {
    setError(false);
  }, [description]);

  const isEdit = useMemo(() => {
    return Boolean(budgetItem.id);
  }, [budgetItem.id]);

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(initialValues) !==
      JSON.stringify({
        description,
        value,
      })
    );
  }, [initialValues, description, value]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoader(true);

    let error;

    if (isEdit) {
      ({ error } = await supabase
        .from<"budget_items", BudgetItems>("budget_items")
        .update({
          description,
          value,
        })
        .eq("id", budgetItem.id));
    } else {
      ({ error } = await supabase
        .from<"budget_items", BudgetItems>("budget_items")
        .insert({
          budget_id: id!,
          description,
          value,
          type,
        }));
    }

    await fetchCurrentBudget(id!);

    setLoader(false);

    if (error) return setError(true);

    setBudgetsFetched(false);

    setDialog({ open: false });

    setSnackbar({
      open: true,
      type: "success",
      message: `${type === "INCOME" ? "Income" : "Expense"} was ${
        isEdit ? "updated" : "added"
      }!`,
    });
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
      }}
    >
      {smAndDown && (
        <IconButton
          size="small"
          sx={{ alignSelf: "end", padding: 0 }}
          onClick={() => setDialog({ open: false })}
        >
          <Close />
        </IconButton>
      )}

      <Stack
        sx={{
          flexGrow: 1,
        }}
        gap={2}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {isEdit ? "Edit" : "Add"} {type === "INCOME" ? "Income" : "Expense"}
        </Typography>

        <TextField
          label="Description"
          variant="outlined"
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={error}
          helperText={
            error
              ? `An ${
                  type === "INCOME" ? "Income" : "Expense"
                } with this description already exists`
              : ""
          }
        />

        <TextField
          label="Value"
          variant="outlined"
          size="small"
          type="number"
          onChange={(e) => setValue(+e.target.value)}
          value={value}
          InputProps={{ inputProps: { min: 0 } }}
        />

        <LoadingButton
          variant="contained"
          type="submit"
          size="small"
          color={type === "INCOME" ? "primary" : "secondary"}
          loading={loader}
          disabled={!value || !description || (isEdit && !hasChanges)}
          sx={{ mt: "auto" }}
        >
          {isEdit ? "Save" : "Add"}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default NewBudgetItem;
