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
  Rating,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { skillSchema } from '../../utils/validationSchemas';
import profileService from '../../services/profileService';
import { hasError, getErrorMessage } from '../../utils/formHelpers';

// Predefined skill categories
const skillCategories = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Database',
  'DevOps',
  'Mobile Development',
  'Design',
  'Tools',
  'Soft Skills',
  'Other',
];

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      level: 3,
      category: '',
    },
    validationSchema: skillSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        let result;
        if (editingId) {
          result = await profileService.skills.update(editingId, values);
          setSkills(skills.map(item => 
            item._id === editingId ? result : item
          ));
        } else {
          result = await profileService.skills.add(values);
          setSkills([...skills, result]);
        }
        resetForm();
        setOpenDialog(false);
        setEditingId(null);
      } catch (err) {
        console.error('Error saving skill:', err);
        setError(err.response?.data?.message || 'Failed to save skill');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const data = await profileService.skills.getAll();
        setSkills(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError(err.response?.data?.message || 'Failed to fetch skills data');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleOpenDialog = (skill = null) => {
    if (skill) {
      setEditingId(skill._id);
      formik.setValues({
        name: skill.name,
        level: skill.level,
        category: skill.category,
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
      await profileService.skills.delete(deletingId);
      setSkills(skills.filter(item => item._id !== deletingId));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError(err.response?.data?.message || 'Failed to delete skill');
      handleCloseDeleteDialog();
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

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
              Skills
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Skill
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
          
          {skills.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <PsychologyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Skills Added Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Start adding your skills to showcase your expertise.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add Skill
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            Object.keys(groupedSkills).map(category => (
              <Card key={category} sx={{ mb: 3 }}>
                <CardHeader title={category} />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    {groupedSkills[category].map(skill => (
                      <Grid item xs={12} sm={6} md={4} key={skill._id}>
                        <Paper 
                          elevation={1} 
                          sx={{ 
                            p: 2, 
                            display: 'flex', 
                            flexDirection: 'column',
                            height: '100%',
                            position: 'relative',
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
                              onClick={() => handleOpenDialog(skill)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleOpenDeleteDialog(skill._id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="h6" gutterBottom>
                            {skill.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                            <Rating 
                              value={skill.level} 
                              readOnly 
                              precision={1}
                              size="small" 
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {skill.level}/5
                            </Typography>
                          </Box>
                          <Chip 
                            label={skill.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                            sx={{ alignSelf: 'flex-start', mt: 'auto' }} 
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      </Grid>

      {/* Add/Edit Skill Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Skill Name"
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
              error={hasError(formik.touched, formik.errors, 'category')}
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                label="Category"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {skillCategories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {hasError(formik.touched, formik.errors, 'category') && (
                <Typography color="error" variant="caption">
                  {getErrorMessage(formik.touched, formik.errors, 'category')}
                </Typography>
              )}
            </FormControl>
            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Proficiency Level (1-5)</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  name="level"
                  value={formik.values.level}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('level', newValue);
                  }}
                  max={5}
                />
                <Typography sx={{ ml: 2 }}>
                  {formik.values.level}/5
                </Typography>
              </Box>
              {hasError(formik.touched, formik.errors, 'level') && (
                <Typography color="error" variant="caption">
                  {getErrorMessage(formik.touched, formik.errors, 'level')}
                </Typography>
              )}
            </Box>
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
            Are you sure you want to delete this skill? This action cannot be undone.
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

export default SkillsPage;
