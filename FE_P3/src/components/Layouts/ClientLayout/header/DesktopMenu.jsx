import { Box, Button, Paper, MenuItem } from "@mui/material";
import { KeyboardArrowDown as ArrowDownIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { pages } from "./menuData";

const DesktopMenu = () => {
    const location = useLocation();
    const [hoveredMenu, setHoveredMenu] = useState(null);

    const isActive = (path) => location.pathname === path;

    return (
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 1 }}>
            {pages.map((page, index) => (
                <Box
                    key={index}
                    onMouseEnter={() => page.children && setHoveredMenu(page.content)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    sx={{ position: 'relative' }}
                >
                    <Button
                        component={page.children ? 'div' : Link}
                        to={page.children ? undefined : page.to}
                        sx={{
                            my: 2,
                            color: (isActive(page.to) || (page.children && location.pathname.includes('/dich-vu')))
                                ? 'primary.main' : 'text.secondary',
                            fontWeight: (isActive(page.to) || (page.children && location.pathname.includes('/dich-vu')))
                                ? 700 : 500,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                        }}
                    >
                        {page.content}
                        {page.children && <ArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />}
                    </Button>

                    {page.children && hoveredMenu === page.content && (
                        <Paper
                            elevation={4}
                            sx={{
                                position: "absolute", top: "100%", left: 0, width: 220,
                                borderRadius: 2, py: 1, zIndex: 10,
                                animation: 'fadeIn 0.2s ease'
                            }}
                        >
                            {page.children.map((child, i) => (
                                <MenuItem
                                    key={i}
                                    component={Link}
                                    to={child.to}
                                    onClick={() => setHoveredMenu(null)}
                                    selected={isActive(child.to)}
                                    sx={{
                                        fontSize: '0.95rem', color: 'text.secondary',
                                        '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' },
                                        '&.Mui-selected': { bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 600 }
                                    }}
                                >
                                    {child.content}
                                </MenuItem>
                            ))}
                        </Paper>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default DesktopMenu;