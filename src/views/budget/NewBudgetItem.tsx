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
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useBudgetStore from "../../store/budget";
import { newBudgetItemDialog } from "./Budget";
import { Close } from "@mui/icons-material";
import useBaseStore from "../../store/base";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface Props {
  type: Enums["budget_item_type"];
  setDialog: (dialog: newBudgetItemDialog) => void;
  budgetItem?: {
    id: string;
    description: string;
    value: number;
  };
}

const schema = yup.object({
  description: yup.string().required().trim(),
  value: yup.number().required().moreThan(0).max(99999999),
});

interface FormInputs {
  description: string;
  value: number;
}

const NewBudgetItem = ({
  type,
  setDialog,
  budgetItem = { id: "", description: "", value: 0 },
}: Props) => {
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

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    formState: { isSubmitted },
  } = useForm<FormInputs>({
    defaultValues: {
      description: budgetItem.description,
      value: budgetItem.value,
    },
    resolver: yupResolver(schema),
  });

  const currentValues = watch();

  useEffect(() => {
    setError(false);
  }, [currentValues.description]);

  const isEdit = useMemo(() => {
    return Boolean(budgetItem.id);
  }, [budgetItem.id]);

  const hasChanges = useMemo(() => {
    const { description, value } = currentValues;

    return (
      JSON.stringify(initialValues) !==
      JSON.stringify({
        description,
        value,
      })
    );
  }, [initialValues, currentValues]);

  const disabled = useMemo(() => {
    const { description, value } = currentValues;

    if (isEdit && !hasChanges) return true; // if on edit mode and no changes made

    if (!description || !value)
      // if value or description are empty
      return true;

    return false;
  }, [isEdit, hasChanges, currentValues]);

  const valueErrorMsg = useMemo(() => {
    if (errors?.value?.type !== "max") return "";

    return errors?.value?.message;
  }, [errors?.value]);

  const onSubmit = async (data: FormInputs) => {
    const { description, value } = data;

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

    if (error) {
      setLoader(false);

      if (error.code === "23505") return setError(true);

      return;
    }

    await fetchCurrentBudget(id!);

    setLoader(false);

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
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {isEdit ? "Edit" : "Add"} {type === "INCOME" ? "Income" : "Expense"}
        </Typography>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              label="Description"
              variant="outlined"
              size="small"
              {...field}
              error={error}
              helperText={
                error
                  ? `An ${
                      type === "INCOME" ? "income" : "expense"
                    } with this description already exists`
                  : ""
              }
            />
          )}
        />

        <Controller
          name="value"
          control={control}
          render={({ field }) => (
            <TextField
              label="Value"
              variant="outlined"
              size="small"
              type="number"
              {...field}
              onFocus={(e) => e.target.select()}
              error={isSubmitted && Boolean(errors.value?.type === "max")}
              helperText={valueErrorMsg}
            />
          )}
        />

        <LoadingButton
          variant="contained"
          type="submit"
          size="small"
          color={type === "INCOME" ? "primary" : "secondary"}
          loading={loader}
          disabled={disabled}
          sx={{ mt: "auto" }}
        >
          {isEdit ? "Save" : "Add"}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default NewBudgetItem;
