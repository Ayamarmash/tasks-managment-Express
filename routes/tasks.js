const express = require("express")
const app = require("../app")
const router = express.Router()


router.get('/', (req, res, next) => {
    res.status(200).json('List of Tasks')
})

router.post('/', (req, res, next) => {
    res.status(201).json('Task Added')
})

router.delete('/', (req, res, next) => {
    res.status(204).json('Task Deleted')
})

module.exports = router