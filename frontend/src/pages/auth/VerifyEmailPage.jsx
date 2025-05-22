import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Avatar,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { EmailOutlined } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmailPage = () => {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setVerifying(false);
        setSuccess(false);
        setMessage('Invalid verification link. Token is missing.');
        return;
      }

      try {
        setVerifying(true);
        const result = await verifyEmail(token);
        setSuccess(true);
        setMessage(result.message || 'Email verified successfully. You can now log in.');
      } catch (error) {
        setSuccess(false);
        setMessage(error.response?.data?.message || 'Email verification failed. Please try again.');
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: success ? 'success.main' : 'primary.main' }}>
          <EmailOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Email Verification
        </Typography>

        {verifying ? (
          <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Verifying your email address...
            </Typography>
          </Box>
        ) : (
          <>
            <Alert severity={success ? 'success' : 'error'} sx={{ mt: 2, width: '100%' }}>
              {message}
            </Alert>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              {success ? (
                <Button
                  component={RouterLink}
                  to="/auth/login"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Proceed to Login
                </Button>
              ) : (
                <Button
                  component={RouterLink}
                  to="/auth/register"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Back to Register
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;
