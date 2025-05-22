import * as Yup from 'yup';

// User auth validations
export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
});

export const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    confirmNewPassword: Yup.string()
        .required('Please confirm your new password')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

// Profile validations
export const profileSchema = Yup.object().shape({
    headline: Yup.string()
        .required('Professional headline is required')
        .max(100, 'Headline cannot exceed 100 characters'),
    bio: Yup.string()
        .required('Bio is required')
        .max(500, 'Bio cannot exceed 500 characters'),
    location: Yup.string()
        .required('Location is required'),
    website: Yup.string()
        .url('Must be a valid URL'),
    github: Yup.string()
        .url('Must be a valid URL'),
    linkedin: Yup.string()
        .url('Must be a valid URL'),
    twitter: Yup.string()
        .url('Must be a valid URL'),
});

// Education validations
export const educationSchema = Yup.object().shape({
    institution: Yup.string()
        .required('Institution name is required'),
    degree: Yup.string()
        .required('Degree is required'),
    field: Yup.string()
        .required('Field of study is required'),
    startDate: Yup.date()
        .required('Start date is required'),
    endDate: Yup.date()
        .nullable()
        .when('current', {
            is: false,
            then: () => Yup.date().required('End date is required'),
        }),
    current: Yup.boolean(),
    description: Yup.string(),
});

// Experience validations
export const experienceSchema = Yup.object().shape({
    company: Yup.string()
        .required('Company name is required'),
    position: Yup.string()
        .required('Position is required'),
    location: Yup.string(),
    startDate: Yup.date()
        .required('Start date is required'),
    endDate: Yup.date()
        .nullable()
        .when('current', {
            is: false,
            then: () => Yup.date().required('End date is required'),
        }),
    current: Yup.boolean(),
    description: Yup.string()
        .required('Description is required'),
});

// Project validations
export const projectSchema = Yup.object().shape({
    name: Yup.string()
        .required('Project name is required')
        .max(100, 'Project name cannot exceed 100 characters'),
    description: Yup.string()
        .required('Description is required')
        .max(500, 'Description cannot exceed 500 characters'),
    startDate: Yup.date()
        .required('Start date is required'),
    endDate: Yup.date()
        .nullable()
        .when('current', {
            is: false,
            then: () => Yup.date().required('End date is required'),
        }),
    current: Yup.boolean(),
    technologies: Yup.string()
        .required('Technologies are required'),
    repoUrl: Yup.string()
        .url('Must be a valid URL'),
    liveUrl: Yup.string()
        .url('Must be a valid URL'),
});

// Skill validations
export const skillSchema = Yup.object().shape({
    name: Yup.string()
        .required('Skill name is required')
        .max(50, 'Skill name cannot exceed 50 characters'),
    level: Yup.number()
        .required('Skill level is required')
        .min(1, 'Skill level must be at least 1')
        .max(5, 'Skill level cannot exceed 5'),
    category: Yup.string()
        .required('Category is required'),
});

// Language validations
export const languageSchema = Yup.object().shape({
    name: Yup.string()
        .required('Language name is required')
        .max(50, 'Language name cannot exceed 50 characters'),
    proficiency: Yup.string()
        .required('Proficiency level is required')
        .oneOf(['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'],
            'Invalid proficiency level'),
});
