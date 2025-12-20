import { Box, Container, Paper, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const CTASection = () => {
  const { t } = useTranslation("aboutus");

  return (
    <Box sx={{ py: 10, bgcolor: "#f4f7f6" }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 6,
            textAlign: "center",
            background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            {t("ctaSection.title")}
          </Typography>
          <Typography sx={{ mb: 4, opacity: 0.9 }}>
            {t("ctaSection.subtitle")}
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: "bold",
              px: 6,
            }}
          >
            {t("ctaSection.button")}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default CTASection;
