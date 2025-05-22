import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../../utils/theme';
import MainNavbar from './MainNavbar';
import Footer from './Footer';

/**
 * MainLayout component
 * Main layout for public pages with navbar and footer
 */
const MainLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <MainNavbar />
        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Outlet />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
