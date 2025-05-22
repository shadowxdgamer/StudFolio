import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Blue
            light: '#63a4ff',
            dark: '#004ba0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f50057', // Pink
            light: '#ff5983',
            dark: '#bb002f',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
            marginBottom: '1rem',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            marginBottom: '0.75rem',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
        },
        subtitle1: {
            fontSize: '1rem',
            marginBottom: '0.25rem',
        },
        subtitle2: {
            fontSize: '0.875rem',
            marginBottom: '0.25rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none', // Don't force uppercase on buttons
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: '16px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
    shape: {
        borderRadius: 8,
    },
});

export default theme;
