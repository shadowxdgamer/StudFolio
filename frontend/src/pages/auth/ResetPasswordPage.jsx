import { useState } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
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
  VisibilityOff,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { resetPasswordSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../contexts/AuthContext';
import { hasError, getErrorMessage } from '../../utils/formHelpers';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, error: authError } = useAuth();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      const result = await resetPassword(token, values.password);
      
      if (result.success) {
        setSuccessMessage(result.message);
        // Redirect to login page after successful password reset
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!token) {
    return (
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Invalid Reset Link
            </Typography>
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              This password reset link is invalid or has expired.
            </Alert>
            <Button
              component={RouterLink}
              to="/auth/forgot-password"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Request a New Link
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Your Password
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {authError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {successMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3, width: '100%' }}
          >
            <Typography variant="body2" color="text.secondary" paragraph>
              Enter your new password below.
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'password')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'password')}
              disabled={!!successMessage}
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'confirmPassword')}
              helperText={getErrorMessage(
                formik.touched,
                formik.errors,
                'confirmPassword'
              )}
              disabled={!!successMessage}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              disabled={formik.isSubmitting || !!successMessage}
            >
              Reset Password
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/auth/login" variant="body2">
                  Remember your password? Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ResetPasswordPage;
