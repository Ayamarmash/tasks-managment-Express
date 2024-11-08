const jwt = require("jsonwebtoken")
const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient()
const rateLimit = require("express-rate-limit");

const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')
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

const authenticate = async (req, res) => {
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
        if (!userData) {
            return res.status(403).json({message: "Incorrect Username or Password"})
        }
        const isPasswordMatch = await bcrypt.compare(user_password, userData.user_password);

        if (!userData || !isPasswordMatch) {
            res.status(403).json({message: "Incorrect Username or Password"})
            return
        }

        const jwtToken = jwt.sign({name: user_name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
        res.status(200).json({token: jwtToken})
    } catch (err) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

const loginRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {message: "Too many login attempts. Please try again after 10 minutes."},
    standardHeaders: true,
    legacyHeaders: false,
});
module.exports = {isAuthenticated, authenticate, loginRateLimiter}