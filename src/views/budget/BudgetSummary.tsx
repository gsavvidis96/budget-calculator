import {
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Functions } from "../../supabase";

const BudgetSummary = ({
  title,
  balance,
  total_expenses,
  total_income,
  expense_percentage,
}: Functions["get_budget"]["Returns"]) => {
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      sx={{
        padding: 3,
        borderRadius: "4px",
        backgroundColor: "budgetCardBg.light",
        border: "1px solid",
        borderColor: "budgetCardBorder.main",
      }}
      gap={1}
    >
      <Typography
        sx={{ alignSelf: "center", textAlign: "center" }}
        variant="body1"
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        sx={{ alignSelf: "center", textAlign: "center" }}
      >
        {balance.toFixed(2)}€
      </Typography>

      <Stack
        direction="row"
        sx={{
          backgroundColor: "primary.main",
          padding: 1,
          borderRadius: "4px",
          width: smAndDown ? "100%" : "350px",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{ alignSelf: "center", textAlign: "center", mr: "auto" }}
        >
          INCOME
        </Typography>

        <Typography
          variant="body2"
          sx={{
            alignSelf: "center",
            textAlign: "center",
            color: "white",
            fontWeight: 500,
          }}
        >
          +{total_income.toFixed(2)}€
        </Typography>
      </Stack>

      <Stack
        direction="row"
        sx={{
          backgroundColor: "secondary.main",
          padding: 1,
          borderRadius: "4px",
          width: smAndDown ? "100%" : "350px",
          alignItems: "center",
          alignSelf: "center",
        }}
        gap={1}
      >
        <Typography
          variant="body2"
          sx={{ alignSelf: "center", textAlign: "center", mr: "auto" }}
        >
          EXPENSES
        </Typography>

        {Boolean(total_income) && (
          <Chip
            size="small"
            label={`${expense_percentage.toFixed(2)}%`}
            sx={{ width: "60px" }}
          />
        )}

        <Typography
          variant="body2"
          sx={{
            alignSelf: "center",
            textAlign: "center",
            color: "white",
            fontWeight: 500,
          }}
        >
          - {total_expenses.toFixed(2)}€
        </Typography>
      </Stack>
    </Stack>
  );
};

export default BudgetSummary;
