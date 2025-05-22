import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MainNavbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            StudFolio
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem 
                  component={RouterLink} 
                  to="/" 
                  onClick={handleClose}
                >
                  Home
                </MenuItem>
                
                {isAuthenticated ? (
                  <>
                    <MenuItem 
                      component={RouterLink} 
                      to="/dashboard" 
                      onClick={handleClose}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem 
                      component={RouterLink} 
                      to="/auth/login" 
                      onClick={handleClose}
                    >
                      Login
                    </MenuItem>
                    <MenuItem 
                      component={RouterLink} 
                      to="/auth/register" 
                      onClick={handleClose}
                    >
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                component={RouterLink}
                to="/"
                sx={{ color: 'white', mr: 2 }}
              >
                Home
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    sx={{ color: 'white', mr: 2 }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={logout}
                    sx={{ color: 'white' }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/auth/login"
                    sx={{ color: 'white', mr: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/auth/register"
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainNavbar;
