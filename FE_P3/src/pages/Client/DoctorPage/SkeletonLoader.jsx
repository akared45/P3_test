import React from "react";
import { Container, Box, Skeleton } from "@mui/material";

const SkeletonLoader = () => (
  <Container maxWidth="lg" sx={{ mt: 5 }}>
    <Box
      sx={{
        display: "flex",
        gap: 4,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ flex: "0 0 360px" }}>
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 3 }} />
      </Box>
    </Box>
  </Container>
);

export default SkeletonLoader;