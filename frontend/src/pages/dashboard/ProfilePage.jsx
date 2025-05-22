import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Alert,
  Typography,
  Avatar,
} from '@mui/material';
import { useFormik } from 'formik';
import { profileSchema } from '../../utils/validationSchemas';
import profileService from '../../services/profileService';
import { hasError, getErrorMessage } from '../../utils/formHelpers';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      title: '',
      bio: '',
      location: '',
      website: '',
      github: '',
      linkedin: '',
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        setError(null);
        setSuccess(null);

        await profileService.updateProfile(values);
        setSuccess('Profile updated successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      } finally {
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profileData = await profileService.getProfile();
        
        // If profile exists, populate the form with existing data
        if (profileData) {
          formik.setValues({
            title: profileData.title || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
            website: profileData.website || '',
            github: profileData.github || '',
            linkedin: profileData.linkedin || '',
          });
        }
      } catch (err) {
        // If it's a 404, that just means no profile yet, not an error to display
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Reset success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Update your professional profile information
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {success && (
          <Grid item xs={12}>
            <Alert severity="success">{success}</Alert>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Profile Preview" />
            <Divider />
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                src={user?.avatar}
                alt={user?.name}
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user?.name || 'User Name'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formik.values.title || 'Your Professional Title'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formik.values.location || 'Your Location'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Profile Information" />
            <Divider />
            <CardContent>
              <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="title"
                      name="title"
                      label="Professional Title"
                      placeholder="e.g. Full Stack Developer"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={hasError(formik.touched, formik.errors, 'title')}
                      helperText={getErrorMessage(formik.touched, formik.errors, 'title')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="bio"
                      name="bio"
                      label="Bio"
                      placeholder="Tell us about yourself"
                      multiline
                      rows={4}
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={hasError(formik.touched, formik.errors, 'bio')}
                      helperText={getErrorMessage(formik.touched, formik.errors, 'bio')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="location"
                      name="location"
                      label="Location"
                      placeholder="e.g. New York, NY"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={hasError(formik.touched, formik.errors, 'location')}
                      helperText={getErrorMessage(formik.touched, formik.errors, 'location')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="website"
                      name="website"
                      label="Personal Website"
                      placeholder="https://yourwebsite.com"
                      value={formik.values.website}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={hasError(formik.touched, formik.errors, 'website')}
                      helperText={getErrorMessage(formik.touched, formik.errors, 'website')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="github"
                      name="github"
                      label="GitHub URL"
                      placeholder="https://github.com/yourusername"
                      value={formik.values.github}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={hasError(formik.touched, formik.errors, 'github')}
                      helperText={getErrorMessage(formik.touched, formik.errors, 'github')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="linkedin"
                      name="linkedin"
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/yourusername"
                      value={formik.values.linkedin}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={hasError(formik.touched, formik.errors, 'linkedin')}
                      helperText={getErrorMessage(formik.touched, formik.errors, 'linkedin')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      sx={{ mt: 2 }}
                    >
                      {saving ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1 }} />
                          Saving...
                        </>
                      ) : (
                        'Save Profile'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
