const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: __dirname + '/../api/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Add a temporary log to verify the variables are loaded
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Loaded' : 'Not loaded');

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
