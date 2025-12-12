import { Typography } from "@mui/material";
import { MedicalServices as MedicalIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Logo = ({ isMobile }) => {
  return (
    <>
      <MedicalIcon 
        sx={{ 
          display: { xs: isMobile ? "flex" : "none", md: isMobile ? "none" : "flex" }, 
          mr: 1, 
          color: 'primary.main', 
          fontSize: isMobile ? 24 : 32 
        }} 
      />
      <Typography
        variant={isMobile ? "h5" : "h6"}
        noWrap
        component={Link}
        to="/"
        sx={{
          mr: isMobile ? 2 : 4,
          display: { xs: isMobile ? "flex" : "none", md: isMobile ? "none" : "flex" },
          flexGrow: isMobile ? 1 : 0,
          fontFamily: "monospace",
          fontWeight: isMobile ? 700 : 800,
          letterSpacing: isMobile ? ".1rem" : ".2rem",
          color: 'primary.main',
          textDecoration: "none",
          fontSize: isMobile ? '1.2rem' : '1.5rem'
        }}
      >
        MEDICARE
      </Typography>
    </>
  );
};

export default Logo;