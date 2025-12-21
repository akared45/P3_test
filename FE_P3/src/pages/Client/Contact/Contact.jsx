import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  ExpandMore,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation("contact");

  // ===== i18n arrays =====
  const contactInfo = t("contactInfo", { returnObjects: true });
  const subjects = t("subjects", { returnObjects: true });
  const faqs = t("faqs", { returnObjects: true });

  const icons = [
    <Phone fontSize="large" />,
    <LocationOn fontSize="large" />,
    <Email fontSize="large" />,
    <AccessTime fontSize="large" />,
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "tuvan",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t("form.alert"));
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 10 }}>
      {/* ===== HEADER ===== */}
      <Box
        sx={{
          bgcolor: "white",
          py: 8,
          textAlign: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            color="primary"
            fontWeight="bold"
            letterSpacing={1.5}
          >
            {t("page.overline")}
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 2 }}>
            {t("page.h3")}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t("page.subtitle")}
          </Typography>
        </Container>
      </Box>

      {/* ===== CONTACT INFO ===== */}
      <Container maxWidth="xl" sx={{ mt: -4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 3,
            mt: "-50px",
            px: 3,
            position: "relative",
            zIndex: 10,
          }}
        >
          {contactInfo.map((item, index) => (
            <Paper
              key={index}
              sx={{
                width: { xs: "100%", sm: "45%", md: "22%" },
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                transition: "0.35s",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 18px 35px rgba(0,0,0,0.18)",
                },
              }}
            >
              <Box sx={{ fontSize: 40, mb: 2 }}>{icons[index]}</Box>
              <Typography variant="h6" fontWeight="bold">
                {item.title}
              </Typography>
              <Typography variant="body2" mt={1} color="text.secondary">
                {item.desc}
              </Typography>
              <Typography fontWeight="bold" mt={1} color="primary">
                {item.info}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* ===== FORM ===== */}
        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 5, borderRadius: 4 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Email color="primary" /> {t("sectionHeader")}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 4 }}>
                {t("form.infoText")}
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t("form.name")}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t("form.phone")}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t("form.email")}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label={t("form.subject")}
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      {subjects.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label={t("form.message")}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ fontWeight: "bold", borderRadius: 2 }}
                    >
                      {t("form.button")}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* ===== FAQ ===== */}
        <Box sx={{ mt: 8 }}>
          <Container maxWidth="md">
            {faqs.map((faq, index) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="bold">{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
