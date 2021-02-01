const app = require('./app');
require("dotenv").config();

app.listen(process.env.PORT || 3001, (err) => {
    console.log(`\nServer running on http://localhost:${process.env.PORT}\n`);
})