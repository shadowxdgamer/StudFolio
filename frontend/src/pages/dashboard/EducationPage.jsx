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
  School as SchoolIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { educationSchema } from '../../utils/validationSchemas';
import profileService from '../../services/profileService';
import { hasError, getErrorMessage, formatDateForInput, formatDateRange } from '../../utils/formHelpers';

const EducationPage = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to safely update education list
  const updateEducationList = (data) => {
    setEducationList(Array.isArray(data) ? data : []);
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const formik = useFormik({
    initialValues: {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
    validationSchema: educationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        let result;      if (editingId) {
          result = await profileService.education.update(editingId, values);
          updateEducationList(educationList.map(item => 
            item._id === editingId ? result.data : item
          ));
        } else {
          result = await profileService.education.add(values);
          updateEducationList([...educationList, result.data]);
        }
        resetForm();
        setOpenDialog(false);
        setEditingId(null);
      } catch (err) {
        console.error('Error saving education:', err);
        setError(err.response?.data?.message || 'Failed to save education');
      } finally {
        setSubmitting(false);
      }
    },
  });
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const data = await profileService.education.getAll();
        updateEducationList(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching education:', err);
        setError(err.response?.data?.message || 'Failed to fetch education data');
        updateEducationList([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const handleOpenDialog = (education = null) => {
    if (education) {
      setEditingId(education._id);
      formik.setValues({
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        startDate: formatDateForInput(education.startDate),
        endDate: education.current ? '' : formatDateForInput(education.endDate),
        current: education.current || false,
        description: education.description || '',
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
    if (!deletingId) return;    try {
      await profileService.education.delete(deletingId);
      updateEducationList(educationList.filter(item => item._id !== deletingId));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting education:', err);
      setError(err.response?.data?.message || 'Failed to delete education');
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
              Education
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Education
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
          
          {educationList.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Education Added Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start adding your educational background to enhance your portfolio.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add Education
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            educationList.map((education) => (
              <Card key={education._id} sx={{ mb: 2 }}>
                <CardHeader
                  title={education.institution}
                  subheader={`${education.degree} in ${education.field}`}
                  action={
                    <Box>
                      <IconButton 
                        onClick={() => handleOpenDialog(education)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDeleteDialog(education._id)}
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
                    {formatDateRange(education.startDate, education.endDate, education.current)}
                  </Typography>
                  {education.description && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {education.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>

      {/* Add/Edit Education Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Education' : 'Add Education'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="institution"
              label="Institution"
              name="institution"
              autoFocus
              value={formik.values.institution}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'institution')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'institution')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="degree"
              label="Degree"
              name="degree"
              value={formik.values.degree}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'degree')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'degree')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="field"
              label="Field of Study"
              name="field"
              value={formik.values.field}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'field')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'field')}
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
              label="I am currently studying here"
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
            Are you sure you want to delete this education entry? This action cannot be undone.
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

export default EducationPage;
