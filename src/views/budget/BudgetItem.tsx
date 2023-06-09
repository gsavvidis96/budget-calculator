import { DeleteOutlineOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import { alpha, Stack } from "@mui/system";
import supabase, { BudgetItems } from "../../supabase";
import { useMemo, useState, MouseEvent } from "react";
import { LoadingButton } from "@mui/lab";

const BudgetItem = ({
  description,
  type,
  value,
  percentage_to_income,
  id,
}: BudgetItems["Row"]) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [loader, setLoader] = useState(false);

  const open = useMemo(() => {
    return Boolean(anchorEl);
  }, [anchorEl]);

  const handleOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDelete = async () => {
    setLoader(true);

    console.log(id);

    await supabase
      .from<"budget_items", BudgetItems>("budget_items")
      .delete()
      .eq("id", id);

    handleClose();

    setLoader(false);
  };

  return (
    <Stack
      sx={{
        borderRadius: "4px",
        transition: "all 0.2s",
        "&:hover": {
          backgroundColor: "budgetCardHover.main",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          py: 2,
          px: 1,
        }}
        gap={1}
      >
        <Typography
          variant="body1"
          sx={{ mr: "auto", textTransform: "capitalize" }}
        >
          {description}
        </Typography>

        {type === "EXPENSES" && (
          <Chip
            label={`${percentage_to_income!.toFixed(2)}%`}
            size="small"
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.error.light, 0.2),
              color: "error.dark",
              fontWeight: 500,
            }}
          />
        )}

        <Typography
          variant="body1"
          sx={{ color: type === "INCOME" ? "primary.main" : "error.light" }}
        >
          {type === "INCOME" ? "+" : "-"} {value.toFixed(2)} €
        </Typography>

        <IconButton size="small" onClick={handleOpen}>
          <DeleteOutlineOutlined
            sx={{
              color: type === "INCOME" ? "primary.main" : "error.light",
              fontSize: "20px",
            }}
          />
        </IconButton>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack sx={{ padding: 1 }} gap={2}>
          <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
            Are you sure you want to {type === "INCOME" ? "income" : "expense"}{" "}
            {description} (
            <Box
              component="span"
              sx={{ color: type === "INCOME" ? "primary.main" : "error.light" }}
            >
              {type === "INCOME" ? "+" : "-"} {value.toFixed(2)} €
            </Box>
            )
          </Typography>

          <Stack direction="row" gap={1} sx={{ justifyContent: "center" }}>
            <Button size="small" onClick={handleClose}>
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
      </Menu>

      <Divider />
    </Stack>
  );
};

export default BudgetItem;
