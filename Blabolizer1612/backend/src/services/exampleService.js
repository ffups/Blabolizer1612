// filepath: backend/src/services/exampleService.js
const supabase = require('../config/supabaseClient');

async function getExampleData() {
    const { data, error } = await supabase
        .from('users') // Replace with your table name
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

module.exports = { getExampleData };