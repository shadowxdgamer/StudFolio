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
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Stack,
  Link,
} from '@mui/material';
import {
  DownloadOutlined,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import profileService from '../../services/profileService';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateRange } from '../../utils/formHelpers';

const CVPreviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await profileService.getCVPreview();
        setCvData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load CV data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCVData();
  }, []);

  const handleGenerateCV = async () => {
    try {
      setGenerating(true);
      setError(null);
      setSuccess(null);
      
      // Get the PDF as a blob
      const pdfBlob = await profileService.generateCV();
      
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'StudFolio_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('CV generated and downloaded successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate CV. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if the user has enough data for a CV
  const hasProfile = !!cvData?.profile;
  const hasEducation = cvData?.education && cvData.education.length > 0;
  const hasExperience = cvData?.experience && cvData.experience.length > 0;

  const missingData = [];
  if (!hasProfile) missingData.push('Profile');
  if (!hasEducation) missingData.push('Education');
  if (!hasExperience) missingData.push('Experience');

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            CV Preview
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Preview and generate your CV based on your portfolio information
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

        {missingData.length > 0 && (
          <Grid item xs={12}>
            <Alert severity="warning">
              Some information is missing for a complete CV: {missingData.join(', ')}. 
              Please add this information before generating your CV.
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="CV Actions"
              action={
                <Button
                  variant="contained"
                  startIcon={<DownloadOutlined />}
                  onClick={handleGenerateCV}
                  disabled={generating || missingData.length > 0}
                >
                  {generating ? 'Generating...' : 'Generate PDF'}
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="CV preview tabs">
                    <Tab label="Preview" />
                    <Tab label="Missing Information" disabled={missingData.length === 0} />
                  </Tabs>
                </Box>
                
                {tabValue === 0 && (
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 4,
                      minHeight: '60vh',
                      backgroundColor: 'white',
                      color: 'black',
                    }}
                  >
                    {/* CV Header */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography variant="h4" gutterBottom fontWeight="bold">
                        {user?.name || 'Your Name'}
                      </Typography>
                      
                      {hasProfile && (
                        <Typography variant="h6" gutterBottom>
                          {cvData.profile.title}
                        </Typography>
                      )}
                      
                      <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2} 
                        justifyContent="center"
                        alignItems="center"
                        sx={{ mt: 2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">{user?.email || 'email@example.com'}</Typography>
                        </Box>
                        
                        {hasProfile && cvData.profile.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">{cvData.profile.location}</Typography>
                          </Box>
                        )}
                        
                        {hasProfile && cvData.profile.website && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinkIcon fontSize="small" sx={{ mr: 1 }} />
                            <Link href={cvData.profile.website} target="_blank" underline="hover" color="inherit">
                              <Typography variant="body2">Personal Website</Typography>
                            </Link>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    {/* Profile/Bio Section */}
                    {hasProfile && cvData.profile.bio && (
                      <>
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1 }} />
                            About Me
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {cvData.profile.bio}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 3 }} />
                      </>
                    )}
                    
                    {/* Education Section */}
                    {hasEducation && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <SchoolIcon sx={{ mr: 1 }} />
                          Education
                        </Typography>
                        
                        {cvData.education.map((edu) => (
                          <Box key={edu._id} sx={{ mb: 2 }}>
                            <Typography variant="h6">
                              {edu.degree} in {edu.field}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {edu.institution}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                            </Typography>
                            {edu.description && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {edu.description}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Experience Section */}
                    {hasExperience && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <WorkIcon sx={{ mr: 1 }} />
                          Experience
                        </Typography>
                        
                        {cvData.experience.map((exp) => (
                          <Box key={exp._id} sx={{ mb: 2 }}>
                            <Typography variant="h6">
                              {exp.position}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {exp.company}
                              {exp.location && ` - ${exp.location}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {exp.description}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Skills Section */}
                    {cvData?.skills && cvData.skills.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <PsychologyIcon sx={{ mr: 1 }} />
                          Skills
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {cvData.skills.map((skill) => (
                            <Grid item key={skill._id} xs={6} sm={4} md={3}>
                              <Paper 
                                elevation={1} 
                                sx={{ 
                                  p: 1, 
                                  textAlign: 'center',
                                  '& .MuiTypography-root': { 
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }
                                }}
                              >
                                <Typography variant="body1">
                                  {skill.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {skill.category}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                    
                    {/* Projects Section */}
                    {cvData?.projects && cvData.projects.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <CodeIcon sx={{ mr: 1 }} />
                          Projects
                        </Typography>
                        
                        {cvData.projects.map((project) => (
                          <Box key={project._id} sx={{ mb: 2 }}>
                            <Typography variant="h6">
                              {project.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {formatDateRange(project.startDate, project.endDate, project.current)}
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {project.description}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              Technologies: {project.technologies}
                            </Typography>
                            
                            {(project.repoUrl || project.liveUrl) && (
                              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                {project.repoUrl && (
                                  <Link href={project.repoUrl} target="_blank" underline="hover">
                                    Repository
                                  </Link>
                                )}
                                {project.liveUrl && (
                                  <Link href={project.liveUrl} target="_blank" underline="hover">
                                    Live Demo
                                  </Link>
                                )}
                              </Stack>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                    
                    {/* Languages Section */}
                    {cvData?.languages && cvData.languages.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <LanguageIcon sx={{ mr: 1 }} />
                          Languages
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {cvData.languages.map((language) => (
                            <Grid item key={language._id} xs={6} sm={4} md={3}>
                              <Paper 
                                elevation={1} 
                                sx={{ 
                                  p: 1, 
                                  textAlign: 'center' 
                                }}
                              >
                                <Typography variant="body1">
                                  {language.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {language.proficiency}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Paper>
                )}

                {tabValue === 1 && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Complete these sections to generate your CV:
                    </Typography>
                    <List>
                      {missingData.includes('Profile') && (
                        <ListItem button component={Link} href="/dashboard/profile">
                          <ListItemIcon>
                            <PersonIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Complete your profile information" 
                            secondary="Add your professional title, bio, and contact information" 
                          />
                        </ListItem>
                      )}
                      {missingData.includes('Education') && (
                        <ListItem button component={Link} href="/dashboard/education">
                          <ListItemIcon>
                            <SchoolIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Add your education history" 
                            secondary="Add at least one educational institution" 
                          />
                        </ListItem>
                      )}
                      {missingData.includes('Experience') && (
                        <ListItem button component={Link} href="/dashboard/experience">
                          <ListItemIcon>
                            <WorkIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Add your work experience" 
                            secondary="Add at least one work experience entry" 
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CVPreviewPage;
