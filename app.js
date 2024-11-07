const express = require("express")
const morgan = require('morgan')
const bodyParser = require("body-parser")
const authRouter = require("./routes/auth")
const tasksRouter = require("./routes/tasks")
const app = express()
const {isAuthenticated} = require("./methods/auth/auth")
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    }
    next()
})


app.use('/auth', authRouter)

// protected routes
app.use('/tasks', isAuthenticated, tasksRouter)
module.exports = app