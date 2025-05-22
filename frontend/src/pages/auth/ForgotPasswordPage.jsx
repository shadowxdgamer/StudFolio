import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import { forgotPasswordSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../contexts/AuthContext';
import { hasError, getErrorMessage } from '../../utils/formHelpers';

const ForgotPasswordPage = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const { forgotPassword, error: authError, clearError } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      const result = await forgotPassword(values.email);
      if (result.success) {
        setSuccessMessage(result.message);
        formik.resetForm();
      }
    },
  });

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
            Forgot Password
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
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
            
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
              disabled={!!successMessage}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting || !!successMessage}
            >
              Send Reset Link
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

export default ForgotPasswordPage;
