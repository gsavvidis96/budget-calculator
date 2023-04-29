import { ImportExport } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MouseEvent, useMemo, useState } from "react";
import useBudgetStore, { BudgetFilter } from "../../store/budget";

const filters = [
  {
    type: BudgetFilter.CREATION_DATE_DESC,
    text: "Creation Date (DESC)",
    isDefault: true,
  },
  {
    type: BudgetFilter.CREATION_DATE_ASC,
    text: "Creation Date (ASC)",
  },

  {
    type: BudgetFilter.BALANCE_DESC,
    text: "Balance (DESC)",
  },
  {
    type: BudgetFilter.BALANCE_ASC,
    text: "Balance (ASC)",
  },
];

const Filters = () => {
  const theme = useTheme();
  const smAndDown = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { filter, setFilter } = useBudgetStore();

  const open = useMemo(() => {
    return Boolean(anchorEl);
  }, [anchorEl]);

  const hideBadge = useMemo(() => {
    return filter === BudgetFilter.CREATION_DATE_DESC;
  }, [filter]);

  const handleOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectFilter = (f: BudgetFilter) => {
    setFilter(f);

    handleClose();
  };

  return (
    <>
      <Badge color="primary" variant="dot" invisible={hideBadge}>
        {smAndDown ? (
          <IconButton
            sx={{ alignSelf: "center" }}
            color="inherit"
            size="small"
            onClick={handleOpen}
          >
            <ImportExport />
          </IconButton>
        ) : (
          <Button
            sx={{ alignSelf: "center" }}
            endIcon={<ImportExport />}
            variant="text"
            color="inherit"
            onClick={handleOpen}
            size="small"
          >
            Sort By
          </Button>
        )}
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {filters.map((f) => (
          <MenuItem
            key={f.type}
            selected={f.type === filter}
            onClick={() => {
              handleSelectFilter(f.type);
            }}
          >
            <Stack direction="row" gap={1}>
              <Box>{f.text}</Box>

              {f.isDefault && <Chip size="small" label="Default" />}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Filters;
