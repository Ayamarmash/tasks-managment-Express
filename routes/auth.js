const express = require("express")
const router = express.Router()
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const {authenticate} = require("../methods/auth/auth")
router.post('/signup', async (req, res, next) => {
    const {user_name, user_password} = {
        user_name: req.body.username,
        user_password: req.body.password
    }
    if (!user_name || !user_password) {
        res.status(400).json("Invalid user input - Bad Request")
        res.end()
        return
    }
    try {
        await prisma.user.create({
            data: {
                user_name: user_name,
                user_password: user_password
            }
        })
    } catch (err) {
        res.status(500).json("Something went wrong - Internal Server Error")
    }
    res.status(201).json("User signed up successfully")
})

router.post('/login', authenticate)

module.exports = router