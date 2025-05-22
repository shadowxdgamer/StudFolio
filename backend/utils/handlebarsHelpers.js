const handlebars = require('handlebars');

const Handlebars = handlebars.create({
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
});

// Helper to format dates
Handlebars.registerHelper('formatDate', function (date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
});

// Helper to get current date
Handlebars.registerHelper('currentDate', function () {
    const d = new Date();
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Helper to check if a value exists
Handlebars.registerHelper('exists', function (value) {
    return value !== undefined && value !== null;
});

module.exports = Handlebars;
