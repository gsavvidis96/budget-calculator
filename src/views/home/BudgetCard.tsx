import {
  Button,
  CircularProgress,
  IconButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  DeleteOutlineOutlined,
  PushPin,
  PushPinOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import supabase, { Budgets } from "../../supabase";
import { SyntheticEvent, useMemo, useState, MouseEvent } from "react";
import { LoadingButton } from "@mui/lab";
import useBudgetStore from "../../store/budget";

const BudgetCard = ({
  created_at,
  id,
  is_pinned,
  title,
  balance,
}: Budgets["Row"]) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const theme = useTheme();
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const { budgets, setBudgets } = useBudgetStore();

  const titleLimit = useMemo(() => {
    if (smAndDown) return 12;

    if (mdAndDown) return 20;

    return 60;
  }, [mdAndDown, smAndDown]);

  const displayedTitle = useMemo(() => {
    return title!.length > titleLimit
      ? title!.substring(0, titleLimit) + "..."
      : title;
  }, [title, titleLimit]);

  const open = useMemo(() => {
    return Boolean(anchorEl);
  }, [anchorEl]);

  const onTogglePin = async (event: SyntheticEvent) => {
    event.preventDefault();

    setLoader(true);

    await supabase
      .from("budgets")
      .update({ is_pinned: !is_pinned })
      .eq("id", id);

    setLoader(false);
  };

  const handleOpen = (event: MouseEvent) => {
    event.preventDefault();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseButton = (event: MouseEvent) => {
    event.preventDefault();

    handleClose();
  };

  const onDelete = async (event: MouseEvent) => {
    event.preventDefault();

    setDeleteLoader(true);

    await supabase.from<"budgets", Budgets>("budgets").delete().eq("id", id);

    setBudgets(budgets.filter((b) => b.id !== id));

    handleClose();

    setDeleteLoader(false);
  };

  return (
    <Stack
      sx={{
        backgroundColor: "budgetCardBg.main",
        border: "1px solid",
        borderColor: "budgetCardBorder.main",
        borderRadius: "4px",
        padding: 3,
        textDecoration: "none",
        color: "inherit",
        transition: "all 0.2s",
        "&:hover": {
          backgroundColor: "budgetCardHover.main",
        },
      }}
      direction="row"
      component={Link}
      to={`/${id}`}
    >
      <Stack gap={1} sx={{ flexGrow: 1 }}>
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {displayedTitle}
          </Typography>

          {loader ? (
            <CircularProgress size="20px" />
          ) : (
            <Tooltip title={is_pinned ? "Unpin" : "Pin"}>
              <IconButton size="small" color="primary" onClick={onTogglePin}>
                {is_pinned ? <PushPin /> : <PushPinOutlined />}
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="subtitle2" color="text.primary">
            Created at:
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {dayjs(created_at).format("DD/MM/YYYY")}
          </Typography>
        </Stack>

        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="subtitle2" color="text.primary">
            Balance:
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {balance.toFixed(2)}€
          </Typography>
        </Stack>
      </Stack>

      <IconButton
        size="small"
        sx={{ alignSelf: "start" }}
        color="secondary"
        onClick={handleOpen}
      >
        <DeleteOutlineOutlined />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseButton}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack sx={{ padding: 1 }} gap={2}>
          <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
            Are you sure you want to delete budget "
            <strong>{displayedTitle}</strong>" ?
          </Typography>

          <Stack direction="row" gap={1} sx={{ justifyContent: "center" }}>
            <Button size="small" onClick={handleCloseButton}>
              Cancel
            </Button>

            <LoadingButton
              variant="contained"
              size="small"
              color="secondary"
              loading={deleteLoader}
              onClick={onDelete}
            >
              Delete
            </LoadingButton>
          </Stack>
        </Stack>
      </Menu>
    </Stack>
  );
};

export default BudgetCard;
