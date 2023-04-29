import { DeleteOutlineOutlined } from "@mui/icons-material";
import { Chip, Divider, IconButton, Typography } from "@mui/material";
import { alpha, Stack } from "@mui/system";

const BudgetItem = ({ title, type, amount, percentage, isLast }: any) => {
  return (
    <Stack
      gap={1}
      sx={{
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
        }}
        gap={1}
      >
        <Typography
          variant="body1"
          sx={{ mr: "auto", textTransform: "capitalize" }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: type === "income" ? "primary.main" : "error.light" }}
        >
          {type === "income" ? "+" : "-"} {amount}€
        </Typography>

        {type === "expense" && (
          <Chip
            label={`${percentage}%`}
            size="small"
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.error.light, 0.2),
              color: "error.dark",
              fontWeight: 500,
            }}
          />
        )}

        <IconButton size="small">
          <DeleteOutlineOutlined
            sx={{
              color: type === "income" ? "primary.main" : "error.light",
              fontSize: "20px",
            }}
          />
        </IconButton>
      </Stack>

      {!isLast && <Divider />}
    </Stack>
  );
};

export default BudgetItem;
