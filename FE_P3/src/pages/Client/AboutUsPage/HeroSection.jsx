import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation("aboutus"); // giả sử JSON nằm ở namespace aboutus
  const hero = t("heroSection", { returnObjects: true });

  return (
    <Box sx={{ bgcolor: "#f4f7f6", py: 8 }}>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flex: "1 1 500px" }}>
          <Typography
            variant="overline"
            color="primary"
            fontWeight="bold"
            letterSpacing={1}
          >
            {hero.overline}
          </Typography>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{ mt: 1, mb: 3, color: "#2c3e50" }}
          >
            {hero.title.split("&").map((part, idx) => (
              <Box
                key={idx}
                component="span"
                sx={{ color: idx === 1 ? "primary.main" : "#2c3e50" }}
              >
                {part.trim()}{" "}
              </Box>
            ))}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            {hero.subtitle}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: 8, px: 4 }}
            >
              {hero.primaryButton}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderRadius: 8, px: 4 }}
            >
              {hero.secondaryButton}
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{ flex: "1 1 500px", display: "flex", justifyContent: "center" }}
        >
          <Box
            component="img"
            src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg"
            sx={{
              width: "100%",
              borderRadius: 4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
