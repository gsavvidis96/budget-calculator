import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import supabase, { Budgets } from "../../supabase";
import { LoadingButton } from "@mui/lab";
import { Close } from "@mui/icons-material";

const NewBudget = ({ setDialog }: { setDialog: (dialog: boolean) => void }) => {
  const [title, setTitle] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));

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

    setDialog(false);
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
          onClick={() => setDialog(false)}
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
          sx={{ mt: "auto" }}
        >
          Add
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default NewBudget;
