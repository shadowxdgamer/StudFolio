const handlebars = require('handlebars');

// Helper to format dates
handlebars.registerHelper('formatDate', function (date, options) {
    if (!date) return '';

    const d = new Date(date);
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
});

// Helper to get current date
handlebars.registerHelper('currentDate', function () {
    const d = new Date();
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

module.exports = handlebars;
