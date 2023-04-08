import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import supabase, { Budgets } from "../supabase";
import useBaseStore from "../store/base";
import { LoadingButton } from "@mui/lab";

const NewBudget = () => {
  const [title, setTitle] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [loader, setLoader] = useState(false);
  const { setDialog } = useBaseStore();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoader(true);

    await supabase
      .from<"budgets", Budgets>("budgets")
      .insert({ title, is_pinned: isPinned });

    setDialog({ open: false, component: null, props: null });

    setLoader(false);
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
