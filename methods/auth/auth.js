const jwt = require("jsonwebtoken")
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()

const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
        return res.status(401).send('Unauthorized')
    }
    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next()
    } catch (err) {
        res.status(401).send('Unauthorized')
    }
}

const authenticate = async (req, res, next) => {
    const {user_name, user_password} = {
        user_name: req.body.username,
        user_password: req.body.password
    }
    try {
        const userData = await prisma.user.findUnique({
            where: {
                user_name: user_name
            }
        })
        if (!userData || userData.user_password !== user_password) {
            res.status(403).json({message: "Incorrect Username or Password"})
            return
        }

        const jwtToken = jwt.sign({name: user_name}, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({token: jwtToken})
    } catch (err) {
        res.status(404).json({message: "Incorrect Username or Password"})
    }
}

module.exports = {isAuthenticated, authenticate}