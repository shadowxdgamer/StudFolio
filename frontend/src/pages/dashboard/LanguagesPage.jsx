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
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { languageSchema } from '../../utils/validationSchemas';
import profileService from '../../services/profileService';
import { hasError, getErrorMessage } from '../../utils/formHelpers';
import { useEntityList } from '../../hooks/useEntityList';

// Predefined proficiency levels
const proficiencyLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Fluent',
  'Native',
];

// Mapping proficiency levels to colors for visual representation
const proficiencyColors = {
  'Beginner': '#FFCDD2',
  'Intermediate': '#FFE0B2',
  'Advanced': '#C8E6C9',
  'Fluent': '#B3E5FC',
  'Native': '#D1C4E9',
};

const LanguagesPage = () => {
  const {
    list: languagesList,
    loading,
    error,
    setError,
    fetchList,
    addItem,
    updateItem,
    deleteItem,
  } = useEntityList(profileService.languages);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      proficiency: 'Intermediate',
    },
    validationSchema: languageSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        let result;
        if (editingId) {
          result = await updateItem(editingId, values);
        } else {
          result = await addItem(values);
        }
        
        if (result.success) {
          resetForm();
          setOpenDialog(false);
          setEditingId(null);
        }
      } catch (err) {
        console.error('Error saving language:', err);
        setError(err.response?.data?.message || 'Failed to save language');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleOpenDialog = (language = null) => {
    if (language) {
      setEditingId(language._id);
      formik.setValues({
        name: language.name,
        proficiency: language.proficiency,
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
      const result = await deleteItem(deletingId);
      if (result.success) {
        handleCloseDeleteDialog();
      }
    } catch (err) {
      console.error('Error deleting language:', err);
      setError(err.response?.data?.message || 'Failed to delete language');
      handleCloseDeleteDialog();
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
              Languages
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Language
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
          
          {languagesList.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <LanguageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Languages Added Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start adding languages you speak to enhance your portfolio.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add Language
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader title="Languages" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  {languagesList.map(language => (
                    <Grid item xs={12} sm={6} md={4} key={language._id}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          position: 'relative',
                          borderLeft: `8px solid ${proficiencyColors[language.proficiency] || '#e0e0e0'}`,
                        }}
                      >
                        <Box sx={{ 
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          display: 'flex',
                        }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog(language)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleOpenDeleteDialog(language._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {language.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Proficiency: {language.proficiency}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Add/Edit Language Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Language' : 'Add Language'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Language Name"
              name="name"
              autoFocus
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={hasError(formik.touched, formik.errors, 'name')}
              helperText={getErrorMessage(formik.touched, formik.errors, 'name')}
            />
            <FormControl 
              fullWidth 
              margin="normal"
              error={hasError(formik.touched, formik.errors, 'proficiency')}
            >
              <InputLabel id="proficiency-label">Proficiency Level</InputLabel>
              <Select
                labelId="proficiency-label"
                id="proficiency"
                name="proficiency"
                value={formik.values.proficiency}
                label="Proficiency Level"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {proficiencyLevels.map(level => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
              {hasError(formik.touched, formik.errors, 'proficiency') && (
                <Typography color="error" variant="caption">
                  {getErrorMessage(formik.touched, formik.errors, 'proficiency')}
                </Typography>
              )}
            </FormControl>
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
            Are you sure you want to delete this language? This action cannot be undone.
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

export default LanguagesPage;
