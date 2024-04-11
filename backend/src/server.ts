import app from './app';
require('dotenv').config();

const PORT = 8080;
app.listen(PORT);
console.log(`Running in port ${PORT}`);