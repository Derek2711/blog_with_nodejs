const express = require(`express`)
const router = express.Router()

// For encrypt and decrypt
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

const Post = require(`../models/Post`)
const User = require(`../models/User`)

const adminLayout = `../views/layouts/admin`

/**
 * GET/
 * Admin- Login
 */
router.get(`/admin`, async (req, res) => {
    try {
        const local = {
            title: `Admin`
        }
        // const data = await Post.find()
        res.render(`admin/login`, { local, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

/**
 * POST/
 * Admin- Basic Auth
 */
router.post(`/admin`, async (req, res) => {
    try {
        const { username, password } = req.body
        
    } catch (error) {
        console.log(error)
    }
})

/**
 * POST/
 * Admin- Register
 */
router.post(`/register`, async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword })
            res.status(201).json({
                message: `User created`,
                user
            })
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({
                    message: `User already exist`
                })
            }
        }
        // res.status(500).json({
        //     message: `Internal server error`
        // })

    } catch (error) {
        console.log(error)
    }
})

module.exports = router