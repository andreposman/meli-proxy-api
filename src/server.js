require('dotenv').config()
const PORT = process.env.SERVER_PORT
const app = require('./app');
const gracefulShutown = require('http-graceful-shutdown');

app.listen(PORT || 3001, (err) => {
    console.log(`\nServer running on http://localhost:${PORT}\n`);
})

gracefulShutown(app)

module.exports = app
