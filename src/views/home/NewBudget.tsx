import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import supabase, { Budgets } from "../../supabase";
import useBaseStore from "../../store/base";
import { LoadingButton } from "@mui/lab";

const NewBudget = () => {
  const [title, setTitle] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const { setDialog } = useBaseStore();

  useEffect(() => {
    setError(false);
  }, [title]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoader(true);

    const { error } = await supabase
      .from<"budgets", Budgets>("budgets")
      .insert({ title, is_pinned: isPinned });

    setLoader(false);

    if (error) return setError(true);

    setDialog({ open: false, component: null });
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
        error={error}
        helperText={error ? "A budget with this name already exists" : ""}
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

      <LoadingButton
        variant="contained"
        type="submit"
        size="small"
        disabled={!title}
        loading={loader}
      >
        Add
      </LoadingButton>
    </Stack>
  );
};

export default NewBudget;
