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

const contactInfoKeys = [
  {
    icon: <Phone fontSize="large" />,
    title: "contactInfo.hotline.title",
    desc: "contactInfo.hotline.desc",
    info: "contactInfo.hotline.info",
    color: "#e74c3c",
  },
  {
    icon: <LocationOn fontSize="large" />,
    title: "contactInfo.address.title",
    desc: "contactInfo.address.desc",
    info: "contactInfo.address.info",
    color: "#1976d2",
  },
  {
    icon: <Email fontSize="large" />,
    title: "contactInfo.email.title",
    desc: "contactInfo.email.desc",
    info: "contactInfo.email.info",
    color: "#f39c12",
  },
  {
    icon: <AccessTime fontSize="large" />,
    title: "contactInfo.hours.title",
    desc: "contactInfo.hours.desc",
    info: "contactInfo.hours.info",
    color: "#27ae60",
  },
];

const faqKeys = [
  { q: "faqs.0.q", a: "faqs.0.a" },
  { q: "faqs.1.q", a: "faqs.1.a" },
  { q: "faqs.2.q", a: "faqs.2.a" },
];

const subjectKeys = [
  { value: "tuvan", label: "subjects.0.label" },
  { value: "datlich", label: "subjects.1.label" },
  { value: "khieu_nai", label: "subjects.2.label" },
  { value: "hop_tac", label: "subjects.3.label" },
];

const Contact = () => {
  const { t } = useTranslation("contact");
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
    console.log("Form Submitted:", formData);
    alert(t("form.alert"));
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 10 }}>
      {/* Header */}
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
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ mt: 1, mb: 2, color: "#2c3e50" }}
          >
            {t("page.h3")}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t("page.subtitle")}
          </Typography>
        </Container>
      </Box>

      {/* Contact Info */}
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
          {contactInfoKeys.map((item, i) => (
            <Paper
              key={i}
              sx={{
                width: { xs: "100%", sm: "45%", md: "22%" },
                p: 4,
                textAlign: "center",
                borderRadius: 4,
                transition: "0.35s",
                transform: "translateY(0)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                background: "#fff",
                "&:hover": {
                  transform: "translateY(-12px)",
                  boxShadow: "0 18px 35px rgba(0,0,0,0.18)",
                },
              }}
            >
              <Box sx={{ fontSize: 40, mb: 2, color: item.color }}>
                {item.icon}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                {t(item.title)}
              </Typography>
              <Typography variant="body2" mt={1} color="text.secondary">
                {t(item.desc)}
              </Typography>
              <Typography fontWeight="bold" mt={1} color="primary">
                {t(item.info)}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Form */}
        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: 5, borderRadius: 4, bgcolor: "white", height: "100%" }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Email color="primary" /> {t("sectionHeader")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t("form.infoText")}
              </Typography>

              <div
                style={{
                  padding: "24px",
                  background: "#fff",
                  borderRadius: "8px",
                }}
              >
                <form onSubmit={handleSubmit}>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
                  >
                    <TextField
                      fullWidth
                      label={t("form.name")}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{ flex: "1 1 48%" }}
                    />
                    <TextField
                      fullWidth
                      label={t("form.phone")}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      sx={{ flex: "1 1 48%" }}
                    />
                    <TextField
                      fullWidth
                      label={t("form.email")}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      sx={{ flex: "1 1 100%" }}
                    />
                    <TextField
                      select
                      fullWidth
                      label={t("form.subject")}
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      sx={{ flex: "1 1 100%" }}
                    >
                      {subjectKeys.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label={t("form.message")}
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      sx={{ flex: "1 1 100%" }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        flex: "1 1 100%",
                        mt: 2,
                        borderRadius: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {t("form.button")}
                    </Button>
                  </div>
                </form>
              </div>
            </Paper>
          </Grid>

          {/* FAQ */}
          <Box sx={{ mt: 8, width: "100%" }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              gutterBottom
            >
              {t("faqsTitle")}
            </Typography>
            <Container maxWidth="md">
              <Box sx={{ mt: 4 }}>
                {faqKeys.map((faq, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      mb: 2,
                      borderRadius: "8px !important",
                      boxShadow: "none",
                      "&:before": { display: "none" },
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore color="primary" />}
                    >
                      <Typography fontWeight="bold" color="#333">
                        {t(faq.q)}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary">{t(faq.a)}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Container>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
