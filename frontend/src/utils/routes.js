import { Navigate } from 'react-router-dom';

// Layout components
import MainLayout from '../components/layouts/MainLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';
import AuthLayout from '../components/layouts/AuthLayout';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// Dashboard pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import EducationPage from '../pages/dashboard/EducationPage';
import ExperiencePage from '../pages/dashboard/ExperiencePage';
import ProjectsPage from '../pages/dashboard/ProjectsPage';
import SkillsPage from '../pages/dashboard/SkillsPage';
import LanguagesPage from '../pages/dashboard/LanguagesPage';

// CV pages
import CVPreviewPage from '../pages/cv/CVPreviewPage';

// Public pages
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected route wrapper
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Route definitions
const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'forgot-password', element: <ForgotPasswordPage /> },
            { path: 'reset-password/:token', element: <ResetPasswordPage /> },
            { path: 'verify-email/:token', element: <VerifyEmailPage /> },
            { path: '', element: <Navigate to="/auth/login" /> },
        ],
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: '', element: <DashboardPage /> },
            { path: 'profile', element: <ProfilePage /> },
            { path: 'education', element: <EducationPage /> },
            { path: 'experience', element: <ExperiencePage /> },
            { path: 'projects', element: <ProjectsPage /> },
            { path: 'skills', element: <SkillsPage /> },
            { path: 'languages', element: <LanguagesPage /> },
            { path: 'cv', element: <CVPreviewPage /> },
        ],
    },
];

export default routes;
