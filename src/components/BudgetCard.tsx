import {
  CircularProgress,
  IconButton,
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
import supabase, { Budgets } from "../supabase";
import { SyntheticEvent, useMemo, useState } from "react";
import useBaseStore, { DialogComponents } from "../store/base";

const BudgetCard = ({
  created_at,
  id,
  is_pinned,
  title,
  balance,
}: Budgets["Row"]) => {
  const [loader, setLoader] = useState(false);
  const { setDialog } = useBaseStore();
  const theme = useTheme();
  const mdAndDown = useMediaQuery(theme.breakpoints.down("md"));
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));

  const titleLimit = useMemo(() => {
    if (smAndDown) return 12;

    if (mdAndDown) return 20;

    return 100;
  }, [mdAndDown, smAndDown]);

  const onTogglePin = async (event: SyntheticEvent) => {
    event.preventDefault();

    setLoader(true);

    await supabase
      .from("budgets")
      .update({ is_pinned: !is_pinned })
      .eq("id", id);

    setLoader(false);
  };

  const onOpenDeleteDialog = (event: SyntheticEvent) => {
    event.preventDefault();

    setDialog({
      open: true,
      component: DialogComponents.DELETE_BUDGET,
      props: {
        id,
        title,
      },
    });
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
            {title!.length > titleLimit
              ? title!.substring(0, titleLimit) + "..."
              : title}
          </Typography>

          {loader ? (
            <CircularProgress size="20px" />
          ) : (
            <Tooltip title={is_pinned ? "Unpin" : "Pin"}>
              <IconButton size="small" color="secondary" onClick={onTogglePin}>
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
            {balance} €
          </Typography>
        </Stack>
      </Stack>

      <IconButton
        size="small"
        sx={{ alignSelf: "start", color: "error.light" }}
        onClick={onOpenDeleteDialog}
      >
        <DeleteOutlineOutlined />
      </IconButton>
    </Stack>
  );
};

export default BudgetCard;
