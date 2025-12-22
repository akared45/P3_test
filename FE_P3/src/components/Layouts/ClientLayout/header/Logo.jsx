import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const Logo = ({ isMobile }) => {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: { xs: isMobile ? "flex" : "none", md: isMobile ? "none" : "flex" },
        alignItems: "center",
        mr: isMobile ? 2 : 4,
      }}
    >
      <Box
        component="img"
        src="./logo.png"  
        alt="Medicare Logo"
        sx={{
          height: isMobile ? 32 : 44,
          width: "auto",
          cursor: "pointer",
        }}
      />
    </Box>
  );
};

export default Logo;
