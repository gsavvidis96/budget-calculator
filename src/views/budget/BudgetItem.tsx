import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  Menu,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha, Stack } from "@mui/system";
import supabase, { BudgetItems } from "../../supabase";
import { useMemo, useState, MouseEvent } from "react";
import { LoadingButton } from "@mui/lab";
import NewBudgetItem from "./NewBudgetItem";
import { newBudgetItemDialog } from "./Budget";

const BudgetItem = ({
  description,
  type,
  value,
  percentage_to_income,
  id,
}: BudgetItems["Row"]) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [loader, setLoader] = useState(false);
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));
  const lgAndDown = useMediaQuery(theme.breakpoints.down("lg"));
  const [dialog, setDialog] = useState<newBudgetItemDialog>({
    open: false,
    type: undefined,
  });

  const descriptionLimit = useMemo(() => {
    if (smAndDown) return 25;

    if (mdAndDown) return 50;

    if (lgAndDown) return 35;

    return 50;
  }, [mdAndDown, smAndDown, lgAndDown]);

  const displayedDescription = useMemo(() => {
    return description!.length > descriptionLimit
      ? description!.substring(0, descriptionLimit) + "..."
      : description;
  }, [description, descriptionLimit]);

  const open = useMemo(() => {
    return Boolean(anchorEl);
  }, [anchorEl]);

  const onOpenDialog = (event: MouseEvent) => {
    event.preventDefault();

    setDialog({
      open: true,
      type,
    });
  };

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
        cursor: "grab",
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
          sx={{
            mr: "auto",
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            overflow: "auto",
          }}
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
          {type === "INCOME" ? "+" : "-"}
          {value.toFixed(2)}€
        </Typography>

        <IconButton size="small" onClick={onOpenDialog}>
          <EditOutlined
            sx={{
              color: type === "INCOME" ? "primary.main" : "error.light",
              fontSize: "20px",
            }}
          />
        </IconButton>

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
            Are you sure you want to delete{" "}
            {type === "INCOME" ? "income" : "expense"} {displayedDescription} (
            <Box
              component="span"
              sx={{
                color: type === "INCOME" ? "primary.main" : "error.light",
                fontSize: "14px",
              }}
            >
              {type === "INCOME" ? "+" : "-"}
              {value.toFixed(2)}€
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

      <Dialog
        onClose={() => setDialog({ open: false })}
        open={dialog.open}
        fullWidth={mdAndDown}
        fullScreen={smAndDown}
        maxWidth={false}
        sx={{
          ".MuiDialog-container .MuiPaper-root": {
            boxShadow: "none",
          },
        }}
      >
        <Stack
          sx={{ width: mdAndDown ? "100%" : "600px", padding: 2, flex: 1 }}
        >
          <NewBudgetItem
            type={type}
            setDialog={setDialog}
            budgetItem={{ id, description, value }}
          />
        </Stack>
      </Dialog>

      <Divider />
    </Stack>
  );
};

export default BudgetItem;
