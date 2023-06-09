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
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import supabase, { Budgets } from "../../supabase";
import { LoadingButton } from "@mui/lab";
import { Close } from "@mui/icons-material";

interface Props {
  setDialog: (dialog: boolean) => void;
  edit?: boolean;
  budgetTitle?: string;
  id?: string;
  budgetIsPinned?: boolean;
}

const NewBudget = ({
  budgetTitle = "",
  budgetIsPinned = false,
  setDialog,
  edit = false,
  id,
}: Props) => {
  const [title, setTitle] = useState(budgetTitle);
  const [isPinned, setIsPinned] = useState(budgetIsPinned);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [initialValues] = useState({
    title: budgetTitle,
    isPinned: budgetIsPinned,
  });
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(initialValues) !==
      JSON.stringify({
        title,
        isPinned,
      })
    );
  }, [initialValues, title, isPinned]);

  useEffect(() => {
    setError(false);
  }, [title]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoader(true);

    let error;

    if (edit) {
      ({ error } = await supabase
        .from<"budgets", Budgets>("budgets")
        .update({ title, is_pinned: isPinned })
        .eq("id", id));
    } else {
      ({ error } = await supabase
        .from<"budgets", Budgets>("budgets")
        .insert({ title, is_pinned: isPinned }));
    }

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
          {edit ? "Edit budget" : "Add a new budget"}
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
          disabled={!title || (edit && !hasChanges)}
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
