import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Database } from "../db_types";
import supabase from "../supabase";

const NewBudget = () => {
  const [title, setTitle] = useState<string>("");
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from<"budgets", Database["public"]["Tables"]["budgets"]>("budgets")
      .insert({ title, is_pinned: isPinned });

    console.log(data);
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
        Add a new budget
      </Typography>

      <TextField
        label="Title"
        variant="outlined"
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <FormGroup sx={{ alignSelf: "start" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isPinned}
              onChange={(event) => setIsPinned(event.target.checked)}
              size="small"
            />
          }
          label="Pinned"
        />
      </FormGroup>

      <Button variant="contained" type="submit" size="small" disabled={!title}>
        Add
      </Button>
    </Stack>
  );
};

export default NewBudget;
