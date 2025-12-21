import { Box, IconButton, Menu, MenuItem, Typography, Divider } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { pages } from "./menuData";

const MobileMenu = () => {
    const { t } = useTranslation(); 
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);

    return (
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton 
                size="large" 
                onClick={handleOpenNavMenu} 
                sx={{ color: "primary.main" }}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
                PaperProps={{
                    sx: { minWidth: '200px' }
                }}
            >
                {pages.map((page, index) => (
                    <Box key={index}>
                        {page.children ? (
                            <>
                                <MenuItem disabled sx={{ opacity: 1, fontWeight: 'bold', color: 'primary.main' }}>
                                    {t(page.key)}
                                </MenuItem>
                                {page.children.map((child, i) => (
                                    <MenuItem key={i} component={Link} to={child.to} onClick={handleCloseNavMenu} sx={{ pl: 4 }}>
                                        <Typography textAlign="center" fontSize={14}>
                                            {t(child.key)} 
                                        </Typography>
                                    </MenuItem>
                                ))}
                                <Divider />
                            </>
                        ) : (
                            <MenuItem component={Link} to={page.to} onClick={handleCloseNavMenu}>
                                <Typography textAlign="left">
                                    {t(page.key)}
                                </Typography>
                            </MenuItem>
                        )}
                    </Box>
                ))}
            </Menu>
        </Box>
    );
};

export default MobileMenu