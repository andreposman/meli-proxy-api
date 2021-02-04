require('dotenv').config()
const PORT = process.env.SERVER_PORT
const app = require('./app');
const gracefulShutown = require('http-graceful-shutdown');

app.listen(PORT || 3001, (err) => {
    console.log(`\nServer running on http://localhost:${PORT}\n`);
})

process.on('SIGTERM', stopHandler);
process.on('SIGINT', stopHandler);
process.on('SIGHUP', stopHandler);
function stopHandler() {
    console.log('\n Stopped forcefully');
    process.exit(0);
}

gracefulShutown(app)

module.exports = app
