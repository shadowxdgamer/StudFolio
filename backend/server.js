const express = require('express');
const app = express();
const cors = require("cors")
const connectDB = require("./config/db.js")
const dotenv = require('dotenv');


dotenv.config();


//Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

//Database connection
connectDB();

//Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const educationRoutes = require('./routes/education');
const experienceRoutes = require('./routes/experience');
const skillRoutes = require('./routes/skill');
const languageRoutes = require('./routes/language');
const projectRoutes = require('./routes/project');
const cvRoutes = require('./routes/cv');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/profile/education', educationRoutes);
app.use('/api/v1/profile/experience', experienceRoutes);
app.use('/api/v1/profile/skills', skillRoutes);
app.use('/api/v1/profile/languages', languageRoutes);
app.use('/api/v1/profile/projects', projectRoutes);
app.use('/api/v1/cv', cvRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message
  });
});

//Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});