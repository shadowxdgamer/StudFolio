import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profile = await profileService.getProfile();
        setProfileData(profile);
        // Update local storage for profile existence
        localStorage.setItem('has_profile', 'true');
      } catch (err) {
        if (err.response?.status === 404) {
          localStorage.removeItem('has_profile');
          setProfileData(null);
        } else {
          console.error('Error fetching profile:', err);
          setError('Failed to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const dashboardItems = [
    {
      title: 'Education',
      icon: <SchoolIcon />,
      path: '/dashboard/education',
      count: profileData?.education?.length || 0,
    },
    {
      title: 'Experience',
      icon: <WorkIcon />,
      path: '/dashboard/experience',
      count: profileData?.experience?.length || 0,
    },
    {
      title: 'Projects',
      icon: <CodeIcon />,
      path: '/dashboard/projects',
      count: profileData?.projects?.length || 0,
    },
    {
      title: 'Skills',
      icon: <PsychologyIcon />,
      path: '/dashboard/skills',
      count: profileData?.skills?.length || 0,
    },
    {
      title: 'Languages',
      icon: <LanguageIcon />,
      path: '/dashboard/languages',
      count: profileData?.languages?.length || 0,
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const hasProfile = !!profileData;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Welcome Message */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.name || 'User'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {hasProfile
                ? `Manage your professional portfolio and generate your CV.`
                : `Let's start by creating your professional profile.`}
            </Typography>
          </Paper>
        </Grid>

        {/* Profile Status Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Profile Status" />
            <Divider />
            <CardContent>
              {hasProfile ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    <strong>Title:</strong> {profileData.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Bio:</strong> {profileData.bio}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Location:</strong> {profileData.location}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/dashboard/profile"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" color="error" gutterBottom>
                    Your profile is not complete.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/dashboard/profile"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Create Your Profile
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* CV Preview & Generation */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="CV Management" />
            <Divider />
            <CardContent>
              <Typography variant="body1" paragraph>
                Preview and generate your professional CV based on your profile
                information.
              </Typography>
              <Button
                component={RouterLink}
                to="/dashboard/cv"
                variant="contained"
                startIcon={<DescriptionIcon />}
              >
                View & Generate CV
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Sections */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Portfolio Sections" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                {dashboardItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.title}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <Box sx={{ mr: 1, color: 'primary.main' }}>
                          {item.icon}
                        </Box>
                        <Typography variant="h6">{item.title}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.count} {item.count === 1 ? 'item' : 'items'} added
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Button
                        component={RouterLink}
                        to={item.path}
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                      >
                        Manage
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'error.light',
                color: 'error.contrastText',
              }}
            >
              <Typography>{error}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
