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
import { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useBudgetStore from "../../store/budget";
import { newBudgetItemDialog } from "./Budget";
import { Close } from "@mui/icons-material";

interface Props {
  type: Enums["budget_item_type"];
  setDialog: (dialog: newBudgetItemDialog) => void;
}

const NewBudgetItem = ({ type, setDialog }: Props) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(0);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { setBudgetsFetched } = useBudgetStore();
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setError(false);
  }, [description]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoader(true);

    const { error } = await supabase
      .from<"budget_items", BudgetItems>("budget_items")
      .insert({
        budget_id: id!,
        description,
        value,
        type,
      });

    setLoader(false);

    if (error) return setError(true);

    setBudgetsFetched(false);

    setDialog({ open: false });
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
          Add {type === "INCOME" ? "Income" : "Expense"}
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
          disabled={!value || !description}
          sx={{ mt: "auto" }}
        >
          Add
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default NewBudgetItem;
