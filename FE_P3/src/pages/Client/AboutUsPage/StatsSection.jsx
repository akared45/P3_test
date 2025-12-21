import { Box, Container, Grid, Typography } from "@mui/material";
import {
  EmojiEvents,
  Groups,
  MedicalServices,
  LocalHospital,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const icons = [EmojiEvents, Groups, MedicalServices, LocalHospital];

const StatsSection = () => {
  const { t } = useTranslation("aboutus");
  const stats = t("statsSection.stats", { returnObjects: true });

  return (
    <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} justifyContent="center">
          {stats.map((item, i) => {
            const Icon = icons[i];
            return (
              <Grid item xs={6} md={3} key={i} textAlign="center">
                <Box sx={{ opacity: 0.8, mb: 1 }}>
                  <Icon fontSize="large" />
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {item.number}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {item.label}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;
