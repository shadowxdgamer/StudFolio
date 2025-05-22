import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../../utils/theme';

/**
 * AuthLayout component
 * Layout for authentication pages (login, register, etc.)
 */
const AuthLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Container 
          maxWidth="sm"
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;
