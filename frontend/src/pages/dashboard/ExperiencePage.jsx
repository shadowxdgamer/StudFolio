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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { experienceSchema } from '../../utils/validationSchemas';
import profileService from '../../services/profileService';
import { hasError, getErrorMessage, formatDateForInput, formatDateRange } from '../../utils/formHelpers';

const ExperiencePage = () => {
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const formik = useFormik({
    initialValues: {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
    validationSchema: experienceSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        let result;
        if (editingId) {
          result = await profileService.experience.update(editingId, values);
          setExperienceList(experienceList.map(item => 
            item._id === editingId ? result : item
          ));
        } else {
          result = await profileService.experience.add(values);
          setExperienceList([...experienceList, result]);
        }
        resetForm();
        setOpenDialog(false);
        setEditingId(null);
      } catch (err) {
        console.error('Error saving experience:', err);
        setError(err.response?.data?.message || 'Failed to save experience');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await profileService.experience.getAll();
        setExperienceList(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError(err.response?.data?.message || 'Failed to fetch experience data');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const handleOpenDialog = (experience = null) => {
    if (experience) {
      setEditingId(experience._id);
      formik.setValues({
        company: experience.company,
        position: experience.position,
        location: experience.location || '',
        startDate: formatDateForInput(experience.startDate),
        endDate: experience.current ? '' : formatDateForInput(experience.endDate),
        current: experience.current || false,
        description: experience.description || '',
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
      await profileService.experience.delete(deletingId);
      setExperienceList(experienceList.filter(item => item._id !== deletingId));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting experience:', err);
      setError(err.response?.data?.message || 'Failed to delete experience');
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
              Work Experience
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Experience
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
          
          {experienceList.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <WorkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Work Experience Added Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start adding your professional experience to enhance your portfolio.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add Experience
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            experienceList.map((experience) => (
              <Card key={experience._id} sx={{ mb: 2 }}>
                <CardHeader
                  title={`${experience.position} at ${experience.company}`}
                  subheader={experience.location}
                  action={
                    <Box>
                      <IconButton 
                        onClick={() => handleOpenDialog(experience)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDeleteDialog(experience._id)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                  </Typography>
                  {experience.description && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {experience.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>

      {/* Add/Edit Experience Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="company"
              label="Company"
              name="company"
              autoFocus
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'company')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'company')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="position"
              label="Position"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'position')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'position')}
            />
            <TextField
              margin="normal"
              fullWidth
              id="location"
              label="Location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'location')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'location')}
            />
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.current}
                  onChange={handleCurrentChange}
                  name="current"
                  color="primary"
                />
              }
              label="I am currently working here"
            />
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'description')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'description')}
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
            Are you sure you want to delete this experience entry? This action cannot be undone.
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

export default ExperiencePage;
