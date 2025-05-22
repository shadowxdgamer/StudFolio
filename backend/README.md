# StudFolio Backend

Backend API for StudFolio - a platform that allows students to create professional CVs and portfolios.

## Features

- 🔐 Authentication with email verification
- 👤 User profiles with personal information
- 🎓 Education history management
- 💼 Work experience tracking
- 🛠️ Skills and languages management
- 🏗️ Project portfolio showcase
- 📄 CV generation in PDF format
- 🌐 Website portfolio generation (coming in V2)

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Puppeteer** for PDF generation
- **Handlebars** for templating
- **Nodemailer** for email sending

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the required environment variables (see `.env.example`)
4. Run the server:

   ```
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `GET /api/v1/auth/verify-email/:token` - Verify email address
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `PUT /api/v1/auth/reset-password/:token` - Reset password
- `PUT /api/v1/auth/update-password` - Update password (when logged in)
- `GET /api/v1/auth/logout` - Logout user

### Profile

- `POST /api/v1/profile` - Create or update profile
- `GET /api/v1/profile/me` - Get current user's profile
- `GET /api/v1/profile/user/:userId` - Get profile by user ID
- `GET /api/v1/profile` - Get all profiles
- `DELETE /api/v1/profile` - Delete profile
- `PUT /api/v1/profile/social` - Update social links

### Education

- `POST /api/v1/profile/education` - Add education
- `GET /api/v1/profile/education` - Get all education entries
- `PUT /api/v1/profile/education/:id` - Update education entry
- `DELETE /api/v1/profile/education/:id` - Delete education entry

### Experience

- `POST /api/v1/profile/experience` - Add work experience
- `GET /api/v1/profile/experience` - Get all experience entries
- `PUT /api/v1/profile/experience/:id` - Update experience entry
- `DELETE /api/v1/profile/experience/:id` - Delete experience entry

### Skills

- `POST /api/v1/profile/skills` - Add skill
- `GET /api/v1/profile/skills` - Get all skills
- `PUT /api/v1/profile/skills/:id` - Update skill
- `DELETE /api/v1/profile/skills/:id` - Delete skill

### Languages

- `POST /api/v1/profile/languages` - Add language
- `GET /api/v1/profile/languages` - Get all languages
- `PUT /api/v1/profile/languages/:id` - Update language
- `DELETE /api/v1/profile/languages/:id` - Delete language

### Projects

- `POST /api/v1/profile/projects` - Add project
- `GET /api/v1/profile/projects` - Get all projects
- `GET /api/v1/profile/projects/featured` - Get featured projects
- `PUT /api/v1/profile/projects/:id` - Update project
- `DELETE /api/v1/profile/projects/:id` - Delete project

### CV

- `GET /api/v1/cv/generate` - Generate PDF CV
