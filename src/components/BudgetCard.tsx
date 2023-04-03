import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import {
  DeleteOutlineOutlined,
  PushPin,
  PushPinOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Database } from "../db_types";
import dayjs from "dayjs";

const BudgetCard = ({
  created_at,
  id,
  is_pinned,
  title,
}: Database["public"]["Tables"]["budgets"]["Row"]) => {
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
      }}
      direction="row"
      component={Link}
      to={`/${id}`}
    >
      <Stack gap={1} sx={{ flexGrow: 1 }}>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          <Tooltip title={is_pinned ? "Unpin" : "Pin"}>
            <IconButton size="small" color="secondary">
              {is_pinned ? <PushPin /> : <PushPinOutlined />}
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="subtitle1" color="text.primary">
            Balance:
          </Typography>

          <Typography variant="body1" color="text.secondary">
            TBD€
          </Typography>
        </Stack>

        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="subtitle1" color="text.primary">
            Created at:
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {dayjs(created_at).format("DD/MM/YYYY HH:mm")}
          </Typography>
        </Stack>
      </Stack>

      <IconButton
        size="small"
        sx={{ alignSelf: "start", color: "error.light" }}
      >
        <DeleteOutlineOutlined />
      </IconButton>
    </Stack>
  );
};

export default BudgetCard;
