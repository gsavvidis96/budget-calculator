import { Stack, TextField, Typography } from "@mui/material";
import supabase, { BudgetItems, Enums } from "../../supabase";
import { LoadingButton } from "@mui/lab";
import { SyntheticEvent, useState } from "react";
import { useParams } from "react-router-dom";

const NewBudgetItem = ({ type }: { type: Enums["budget_item_type"] }) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(0);
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await supabase.from<"budget_items", BudgetItems>("budget_items").insert({
      budget_id: id!,
      description,
      value,
      type,
    });

    console.log("handleSubmit");
  };

  return (
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
      />

      <TextField
        label="Value"
        variant="outlined"
        size="small"
        type="number"
        onChange={(e) => setValue(+e.target.value)}
        value={value}
      />

      <LoadingButton
        variant="contained"
        type="submit"
        size="small"
        color={type === "INCOME" ? "primary" : "error"}
      >
        Add
      </LoadingButton>
    </Stack>
  );
};

export default NewBudgetItem;
