import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  CardMedia,
  Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  School as SchoolIcon,
  Work as WorkIcon, 
  Code as CodeIcon, 
  Description as DescriptionIcon 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    title: 'Profile Management',
    description: 'Create and manage your professional profile with ease.',
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Experience & Education',
    description: 'Showcase your work history and educational background.',
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Projects & Skills',
    description: 'Highlight your projects and technical skills.',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'CV Generation',
    description: 'Generate professional CVs in various formats.',
    icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
  },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 2,
          mb: 6,
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Build Your Professional Portfolio
              </Typography>
              <Typography variant="h5" paragraph>
                StudFolio helps students and professionals create impressive portfolios
                and CVs to showcase their skills and experience.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
                {isAuthenticated ? (
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="contained"
                    size="large"
                    color="secondary"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/auth/register"
                      variant="contained"
                      size="large"
                      color="secondary"
                    >
                      Get Started
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/auth/login"
                      variant="outlined"
                      size="large"
                      sx={{ color: 'white', borderColor: 'white' }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <img 
                  src="/hero-image.png" 
                  alt="Portfolio showcase" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '400px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=StudFolio';
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ my: 6 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Features
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Everything you need to build your professional online presence
          </Typography>
          <Grid container spacing={4} mt={4}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ mb: 2, color: 'primary.main' }}>
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3">
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Ready to build your professional portfolio?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Join thousands of professionals who have already created stunning portfolios with StudFolio.
          </Typography>
          {!isAuthenticated && (
            <Button
              component={RouterLink}
              to="/auth/register"
              variant="contained"
              size="large"
              color="primary"
              sx={{ mt: 2 }}
            >
              Create Your Portfolio Now
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
