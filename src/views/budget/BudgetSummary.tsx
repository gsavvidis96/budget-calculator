import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";

const BudgetSummary = ({ title }: any) => {
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
        0.00 €
      </Typography>

      <Stack
        direction="row"
        sx={{
          backgroundColor: "primary.light",
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
          + 0.00
        </Typography>
      </Stack>

      <Stack
        direction="row"
        sx={{
          backgroundColor: "error.light",
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
          EXPENSES
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
          - 0.00
        </Typography>
      </Stack>
    </Stack>
  );
};

export default BudgetSummary;
