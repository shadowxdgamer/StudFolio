import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { 
  LockOutlined as LockOutlinedIcon, 
  Visibility, 
  VisibilityOff 
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../contexts/AuthContext';
import { hasError, getErrorMessage } from '../../utils/formHelpers';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const result = await login(values);
      if (result.success) {
        navigate('/dashboard');
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in to StudFolio
          </Typography>
          
          {authError && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {authError}
            </Alert>
          )}
          
          <Box 
            component="form" 
            onSubmit={formik.handleSubmit} 
            sx={{ mt: 3, width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'email')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'email')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'password')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
            >
              Sign In
            </Button>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Link component={RouterLink} to="/auth/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/auth/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
