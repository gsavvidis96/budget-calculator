import { Button, Stack, Typography } from "@mui/material";
import useBaseStore from "../../store/base";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import supabase, { Budgets } from "../../supabase";
import useBudgetStore from "../../store/budget";

const DeleteBudget = ({ id, title }: { id: string; title: string }) => {
  const { setDialog } = useBaseStore();
  const { budgets, setBudgets } = useBudgetStore();
  const [loader, setLoader] = useState(false);

  const onDelete = async () => {
    setLoader(true);

    await supabase.from<"budgets", Budgets>("budgets").delete().eq("id", id);

    setBudgets(budgets.filter((b) => b.id !== id));

    setDialog({ open: false, component: null });

    setLoader(false);
  };

  const onClose = () => {
    setDialog({ open: false, component: null });
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
        alignItems: "center",
      }}
      gap={2}
    >
      <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
        Are you sure you want to delete budget "<strong>{title}</strong>" ?
      </Typography>

      <Stack direction="row" gap={1}>
        <Button size="small" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          variant="contained"
          size="small"
          color="secondary"
          loading={loader}
          onClick={onDelete}
        >
          Delete
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default DeleteBudget;
