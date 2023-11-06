import {
    AppBar,
    Toolbar,
    Switch,
    FormControlLabel,
    IconButton,
    Typography,
    Button,
    Box,
    Menu,
    MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SessionHelper from '../../Auth/SessionHelper';

export function MenuBar(props: {
    sessionHelper: SessionHelper;
    authorized: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const navigate = useNavigate();
    function onSwitchChange(
        _: React.ChangeEvent<HTMLElement>,
        checked: boolean
    ) {
        props.setDarkMode(checked);
    }

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = (page: string | null) => {
        setAnchorElNav(null);
        if (page) navigate(`/${page}`);
    };
    const handleLogout = () => {
        props.sessionHelper.logout();
        navigate(`/login`);
    };

    const pages = [
        { text: 'Home', href: 'home' },
        { text: 'Docs', href: 'docs' },
        { text: 'About', href: 'about' }
    ];

    return (
        <AppBar position="sticky" sx={{ width: '100%' }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleOpenNavMenu}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={() => {
                        handleCloseNavMenu(null);
                    }}
                    sx={{
                        display: 'block'
                    }}
                >
                    {pages.map((page) => (
                        <MenuItem
                            key={page.text}
                            onClick={() => handleCloseNavMenu(page.href)}
                        >
                            <Typography textAlign="center">
                                {page.text}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>
                <Typography
                    variant="h6"
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                    Bods v0.1.1-alpha
                </Typography>
                {/* Provides empty space */}
                <Box sx={{ flexGrow: 1 }}></Box>
                <FormControlLabel
                    control={
                        <Switch defaultChecked onChange={onSwitchChange} />
                    }
                    label="Dark Mode"
                />
                {props.authorized ? (
                    <Button
                        variant="contained"
                        color="info"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : null}
            </Toolbar>
        </AppBar>
    );
}
