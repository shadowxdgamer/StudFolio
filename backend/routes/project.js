const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    addProject,
    getProjects,
    getFeaturedProjects,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { projectValidation } = require('../middleware/validator');

router.post('/', protect, projectValidation, addProject);
router.get('/', protect, getProjects);
router.get('/featured', protect, getFeaturedProjects);
router.put('/:id', protect, projectValidation, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
