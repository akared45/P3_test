import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("footer"); // namespace footer

  const serviceItems = [
    t("serviceItem1"),
    t("serviceItem2"),
    t("serviceItem3"),
    t("serviceItem4"),
  ];

  const footerLinks = [t("terms"), t("privacy"), t("support")];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a2027",
        color: "#fff",
        py: 6,
        mt: "auto",
        borderTop: "4px solid",
        borderColor: "primary.main",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MedicalIcon
                sx={{ fontSize: 40, mr: 1, color: "primary.light" }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ letterSpacing: 1 }}
              >
                {t("companyName")}
              </Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t("companyFullName")}
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <LocationIcon color="primary" sx={{ fontSize: 20, mt: 0.3 }} />
                <Typography variant="body2" color="grey.400">
                  {t("clinicAddress1")} <br />
                  {t("clinicAddress2")}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <EmailIcon color="primary" sx={{ fontSize: 20 }} />
                <MuiLink
                  href={`mailto:${t("email")}`}
                  color="grey.400"
                  underline="hover"
                >
                  {t("email")}
                </MuiLink>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <PhoneIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="body2" color="grey.400">
                  {t("hotlineLabel")} <br />
                  {t("hotlineNumbers")}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "primary.light" }}
            >
              {t("servicesTitle")}
            </Typography>
            <Stack spacing={1}>
              {serviceItems.map((item, index) => (
                <MuiLink
                  key={index}
                  component={Link}
                  to="#"
                  color="grey.400"
                  underline="hover"
                  sx={{ display: "block", fontSize: "0.95rem" }}
                >
                  {item}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "primary.light" }}
            >
              {t("socialTitle")}
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
              {t("socialDescription")}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <IconButton
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "#1877f2" },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "#ff0000" },
                }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  "&:hover": { bgcolor: "#0077b5" },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>

            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "primary.light", fontSize: "1rem" }}
            >
              {t("downloadAppTitle")}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Box
                component="img"
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                sx={{ height: 40, cursor: "pointer" }}
              />
              <Box
                component="img"
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                sx={{ height: 40, cursor: "pointer" }}
              />
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.500" textAlign="center">
            {t("copyright")}
          </Typography>

          <Stack direction="row" spacing={3}>
            {footerLinks.map((text, index) => (
              <MuiLink
                key={index}
                href="#"
                color="grey.500"
                underline="hover"
                sx={{ fontSize: "0.85rem" }}
              >
                {text}
              </MuiLink>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
