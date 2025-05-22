import { useState, useEffect, useRef } from 'react';
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
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const isMounted = useRef(true);

  const formik = useFormik({
    initialValues: {
      headline: '',
      bio: '',
      location: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        setError(null);
        setSuccess(null);

        // Split the values into profile and social data
        const profileData = {
          headline: values.headline,
          bio: values.bio,
          location: values.location,
          website: values.website,
        };

        const socialData = {
          github: values.github,
          linkedin: values.linkedin,
          twitter: values.twitter,
        };

        // Update profile first
        await profileService.updateProfile(profileData);
        
        // Then update social links
        await profileService.updateSocialLinks(socialData);
        
        if (isMounted.current) {
          setSuccess('Profile updated successfully!');
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        }
      } finally {
        if (isMounted.current) {
          setSaving(false);
        }
      }
    },
  });

  // Effect to handle cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Effect to fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isMounted.current) return;

      try {
        setLoading(true);
        setError(null);
        
        const profileData = await profileService.getProfile();
        
        if (isMounted.current && profileData) {
          formik.setValues({
            headline: profileData.headline || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
            website: profileData.website || '',
            github: profileData.social?.github || '',
            linkedin: profileData.social?.linkedin || '',
            twitter: profileData.social?.twitter || '',
          }, false); // Add false to prevent validation on initial load
        }
      } catch (err) {
        // If it's a 404, that just means no profile yet, not an error to display
        if (err.response?.status !== 404 && isMounted.current) {
          setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We want this effect to run only once on mount

  // Reset success message after 5 seconds
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      if (isMounted.current) {
        setSuccess(null);
      }
    }, 5000);

    return () => clearTimeout(timer);
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
                {formik.values.headline || 'Your Professional Title'}
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
                      id="headline"
                      name="headline"
                      label="Professional Headline"
                      placeholder="e.g. Full Stack Developer"
                      value={formik.values.headline}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={hasError(formik.touched, formik.errors, 'headline')}
                      helperText={getErrorMessage(formik.touched, formik.errors, 'headline')}
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      id="twitter"
                      name="twitter"
                      label="Twitter URL"
                      placeholder="https://twitter.com/yourusername"
                      value={formik.values.twitter}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={hasError(formik.touched, formik.errors, 'twitter')}
                      helperText={getErrorMessage(formik.touched, formik.errors, 'twitter')}
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
