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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Link,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { projectSchema } from '../../utils/validationSchemas';
import profileService from '../../services/profileService';
import { hasError, getErrorMessage, formatDateForInput, formatDateRange } from '../../utils/formHelpers';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
      technologies: '',
      repoUrl: '',
      liveUrl: '',
    },
    validationSchema: projectSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        let result;
        if (editingId) {
          result = await profileService.projects.update(editingId, values);
          setProjects(projects.map(item => 
            item._id === editingId ? result : item
          ));
        } else {
          result = await profileService.projects.add(values);
          setProjects([...projects, result]);
        }
        resetForm();
        setOpenDialog(false);
        setEditingId(null);
      } catch (err) {
        console.error('Error saving project:', err);
        setError(err.response?.data?.message || 'Failed to save project');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await profileService.projects.getAll();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.response?.data?.message || 'Failed to fetch projects data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingId(project._id);
      formik.setValues({
        name: project.name,
        description: project.description,
        startDate: formatDateForInput(project.startDate),
        endDate: project.current ? '' : formatDateForInput(project.endDate),
        current: project.current || false,
        technologies: project.technologies || '',
        repoUrl: project.repoUrl || '',
        liveUrl: project.liveUrl || '',
      });
    } else {
      setEditingId(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    formik.resetForm();
  };

  const handleOpenDeleteDialog = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await profileService.projects.delete(deletingId);
      setProjects(projects.filter(item => item._id !== deletingId));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.response?.data?.message || 'Failed to delete project');
      handleCloseDeleteDialog();
    }
  };

  const handleCurrentChange = (e) => {
    const { checked } = e.target;
    formik.setFieldValue('current', checked);
    if (checked) {
      formik.setFieldValue('endDate', '');
    }
  };

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Projects
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Project
            </Button>
          </Box>

          {error && (
            <Paper 
              sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: 'error.light', 
                color: 'error.contrastText' 
              }}
            >
              <Typography>{error}</Typography>
            </Paper>
          )}
          
          {projects.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CodeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Projects Added Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start adding your projects to showcase your skills and accomplishments.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add Project
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {projects.map((project) => (
                <Grid item xs={12} md={6} key={project._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardHeader
                      title={project.name}
                      action={
                        <Box>
                          <IconButton 
                            onClick={() => handleOpenDialog(project)}
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpenDeleteDialog(project._id)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    />
                    <Divider />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {formatDateRange(project.startDate, project.endDate, project.current)}
                      </Typography>
                      <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                        {project.description}
                      </Typography>
                      {project.technologies && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Technologies:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {project.technologies.split(',').map((tech, index) => (
                              <Chip 
                                key={index} 
                                label={tech.trim()} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        {project.repoUrl && (
                          <Link 
                            href={project.repoUrl} 
                            target="_blank" 
                            rel="noopener"
                            sx={{ display: 'flex', alignItems: 'center', mr: 2 }}
                          >
                            <GitHubIcon sx={{ mr: 0.5 }} fontSize="small" />
                            Repository
                          </Link>
                        )}
                        {project.liveUrl && (
                          <Link 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener"
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <LaunchIcon sx={{ mr: 0.5 }} fontSize="small" />
                            Live Demo
                          </Link>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Add/Edit Project Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Project Name"
              name="name"
              autoFocus
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'name')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'name')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Project Description"
              name="description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'description')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'description')}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="startDate"
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={hasError(formik.touched, formik.errors, 'startDate')}
                  helperText={getErrorMessage(formik.touched, formik.errors, 'startDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {!formik.values.current && (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="endDate"
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={hasError(formik.touched, formik.errors, 'endDate')}
                    helperText={getErrorMessage(formik.touched, formik.errors, 'endDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              </Grid>
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.current}
                  onChange={handleCurrentChange}
                  name="current"
                  color="primary"
                />
              }
              label="This is an ongoing project"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="technologies"
              label="Technologies Used"
              name="technologies"
              placeholder="e.g. React, Node.js, MongoDB (comma-separated)"
              value={formik.values.technologies}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'technologies')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'technologies')}
            />
            <TextField
              margin="normal"
              fullWidth
              id="repoUrl"
              label="Repository URL"
              name="repoUrl"
              placeholder="e.g. https://github.com/username/repo"
              value={formik.values.repoUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'repoUrl')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'repoUrl')}
            />
            <TextField
              margin="normal"
              fullWidth
              id="liveUrl"
              label="Live Demo URL"
              name="liveUrl"
              placeholder="e.g. https://project-demo.com"
              value={formik.values.liveUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'liveUrl')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'liveUrl')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={() => formik.handleSubmit()} 
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectsPage;
