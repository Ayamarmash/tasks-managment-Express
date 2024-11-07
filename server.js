const http = require("http")
const app = require("./app")
const port = process.env.PORT || 5000

const server = http.createServer(app)
server.listen(port, (err) => {
    if (err) {
        console.log("Error occurred")
        throw err
    }
    console.log(`✅  Server Is Running at: http://localhost:${port}`)
})