/**
 * Helper function to get form error from Formik
 * @param {Object} touched - Formik touched object
 * @param {Object} errors - Formik errors object
 * @param {string} fieldName - Field name to check for errors
 * @returns {boolean} Whether the field has an error and has been touched
 */
export const hasError = (touched, errors, fieldName) => {
    return Boolean(touched[fieldName] && errors[fieldName]);
};

/**
 * Helper function to get form error message from Formik
 * @param {Object} touched - Formik touched object
 * @param {Object} errors - Formik errors object
 * @param {string} fieldName - Field name to get error message for
 * @returns {string|undefined} Error message if field has an error and has been touched
 */
export const getErrorMessage = (touched, errors, fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : undefined;
};

/**
 * Format date from ISO string to YYYY-MM-DD
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (Month Year format)
 */
export const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
};

/**
 * Create date range string from start and end date
 * @param {string} startDate - ISO date string for start date
 * @param {string|null} endDate - ISO date string for end date or null
 * @param {boolean} current - Whether this is a current position
 * @returns {string} Formatted date range string
 */
export const formatDateRange = (startDate, endDate, current = false) => {
    const start = formatDateForDisplay(startDate);
    const end = current ? 'Present' : formatDateForDisplay(endDate);
    return `${start} - ${end}`;
};
