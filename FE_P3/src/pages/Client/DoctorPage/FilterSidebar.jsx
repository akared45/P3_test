import React from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Slider,
  IconButton,
  Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const DAYS_OF_WEEK = [
  { key: "monday", value: "Monday" },
  { key: "tuesday", value: "Tuesday" },
  { key: "wednesday", value: "Wednesday" },
  { key: "thursday", value: "Thursday" },
  { key: "friday", value: "Friday" },
  { key: "saturday", value: "Saturday" },
  { key: "sunday", value: "Sunday" },
];

const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedSpec,
  setSelectedSpec,
  selectedDays,
  handleDayChange,
  experienceRange,
  setExperienceRange,
  specializations,
  handleClearFilters,
  isMobile,
  drawerOpen,
  setDrawerOpen,
  isDrawerOnly = false,
}) => {
  const { t } = useTranslation("admin_doctors");
  const FilterContent = ({ isDrawer = false }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: isDrawer ? 0 : 4,
        border: "1px solid #ececec",
        height: "fit-content",
        position: isDrawer ? "relative" : "sticky",
        top: isDrawer ? 0 : 20,
        maxHeight: isDrawer ? "100vh" : "calc(100vh - 100px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c1c1c1",
          borderRadius: "3px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            {t("filter.title")}
          </Typography>
        </Box>
        {isDrawer && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        {t("filter.doctorName")}
      </Typography>
      <TextField
        fullWidth
        placeholder={t("filter.searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
        size="small"
      />

      <Divider sx={{ mb: 3 }} />
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
        {t("filter.specialization")}
      </Typography>
      <TextField
        select
        fullWidth
        value={selectedSpec}
        onChange={(e) => setSelectedSpec(e.target.value)}
        sx={{ mb: 4 }}
        size="small"
      >
        <MenuItem value="all">{t("filter.allSpecializations")}</MenuItem>
        {specializations.map((spec) => (
          <MenuItem key={spec.code} value={spec.code}>
            {spec.name}
          </MenuItem>
        ))}
      </TextField>

      <Divider sx={{ mb: 3 }} />
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 4 }}>
        {t("filter.experience")}: {experienceRange[0]} - {experienceRange[1]}{" "}
        {t("filter.year")}
      </Typography>
      <Slider
        value={experienceRange}
        onChange={(e, newValue) => setExperienceRange(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={40}
        sx={{ mb: 4, mx: 1, width: "90%" }}
      />

      <Divider sx={{ mb: 3 }} />
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
        {t("filter.workingDays")}
      </Typography>
      <FormGroup>
        {DAYS_OF_WEEK.map((day) => (
          <FormControlLabel
            key={day.value}
            control={
              <Checkbox
                size="small"
                checked={selectedDays.includes(day.value)}
                onChange={() => handleDayChange(day.value)}
              />
            }
            label={
              <Typography variant="body2">
                {t(`filter.days.${day.key}`)}
              </Typography>
            }
            sx={{ mb: 0.5 }}
          />
        ))}
      </FormGroup>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={handleClearFilters}
        >
          {t("filter.clearAll")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => isDrawer && setDrawerOpen(false)}
        >
          {t("filter.apply")}
        </Typography>
      </Box>
    </Paper>
  );

  if (isMobile && drawerOpen !== undefined && setDrawerOpen !== undefined) {
    return (
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 400,
            borderRadius: "0",
          },
        }}
      >
        <FilterContent isDrawer={true} />
      </Drawer>
    );
  }

  if (isDrawerOnly && !isMobile) {
    return null;
  }

  return <FilterContent />;
};

export default FilterSidebar;
