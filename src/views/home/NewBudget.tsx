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
import useBudgetStore from "../../store/budget";
import useBaseStore from "../../store/base";

interface Props {
  setDialog: (dialog: boolean) => void;
  budget?: {
    id: string;
    title: string;
    isPinned: boolean;
  };
}

const NewBudget = ({
  setDialog,
  budget = { id: "", title: "", isPinned: false },
}: Props) => {
  const [title, setTitle] = useState(budget.title);
  const [isPinned, setIsPinned] = useState(budget.isPinned);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [initialValues] = useState({
    title: budget.title,
    isPinned: budget.isPinned,
  });
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const { fetchBudgets } = useBudgetStore();
  const { setSnackbar } = useBaseStore();

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(initialValues) !==
      JSON.stringify({
        title,
        isPinned,
      })
    );
  }, [initialValues, title, isPinned]);

  const isEdit = useMemo(() => {
    return Boolean(budget.id);
  }, [budget.id]);

  useEffect(() => {
    setError(false);
  }, [title]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setLoader(true);

    let error;

    if (isEdit) {
      ({ error } = await supabase
        .from<"budgets", Budgets>("budgets")
        .update({ title, is_pinned: isPinned })
        .eq("id", budget.id));
    } else {
      ({ error } = await supabase
        .from<"budgets", Budgets>("budgets")
        .insert({ title, is_pinned: isPinned }));
    }

    await fetchBudgets({ refresh: true });

    setLoader(false);

    if (error) return setError(true);

    setSnackbar({
      open: true,
      type: "success",
      message: `Budget was ${isEdit ? "updated" : "added"}!`,
    });

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
          {isEdit ? "Edit budget" : "Add a new budget"}
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
          disabled={!title || (isEdit && !hasChanges)}
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
