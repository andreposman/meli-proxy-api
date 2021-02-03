const app = require('./app');
const gracefulShutown = require('http-graceful-shutdown');
require('dotenv').config()

const PORT = process.env.SERVER_PORT

try {
    const server = app.listen(PORT || 3001, (err) => {
        console.log(`\nServer running on http://localhost:${PORT}\n`);
    })

    gracefulShutown(server)

} catch (error) {
    throw error
}

