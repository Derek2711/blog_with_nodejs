const express = require(`express`)
const router = express.Router()

// For encrypt and decrypt
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

const Post = require(`../models/Post`)
const User = require(`../models/User`)

const jwtSecret = process.env.JWT_SECRET

const adminLayout = `../views/layouts/admin`


/**
 * Check- Login
 */
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: `Unauthorized` })
    }

    try {
        const decoded = await jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: `Unauthorized` })
    }
}

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
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: `Invalid credentials` });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: `Invalid credentials` });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie(`token`, token, { httpOnly: true });
        res.redirect(`/dashboard`)

    } catch (error) {
        console.log(error)
    }
})


/**
 * GET/
 * Admin- Dashboard
 */
router.get(`/dashboard`, authMiddleware, async (req, res) => {
    try {
        const local = {
            title: `Admin Dashboard`
        }
        const data = await Post.find().sort({ createdAt: -1 })
        res.render(`admin/dashboard`, { local, data, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

/**
 * GET/
 * Admin- Render Add Post
 */
router.get(`/add-post`, authMiddleware, async (req, res) => {
    try {
        const local = {
            title: `Add Post`
        }
        res.render(`admin/add-post`, { local, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})


/**
 * POST/
 * Admin- Create a new post
 */
router.post(`/add-post`, authMiddleware, async (req, res) => {
    try {
        let newPost = {
            title: req.body.title,
            body: req.body.body
        };
        await Post.create(newPost)

        res.redirect(`/dashboard`)
    } catch (error) {
        console.log(error)
    }
})


/**
 * GET/
 * Admin- Render Edit Post
 */
router.get(`/edit-post/:id`, authMiddleware, async (req, res) => {
    try {
        const local = {
            title: `Add Post`
        }
        const data = await Post.findById(req.params.id)
        res.render(`admin/edit-post`, { data, local, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})


/**
 * PUT/
 * Admin- Edit Post
 */
router.put(`/edit-post/:id`, authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body
        })

        res.redirect(`/dashboard`)

    } catch (error) {
        console.log(error)
    }
})

/**
 * DELETE/
 * Admin- Delete Post
 */
router.delete(`/delete-post/:id`, authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id })
        res.redirect(`/dashboard`)
    } catch (error) {
        console.log(error)
    }
})


/**
 * GET/
 * Admin- Logout
 */
router.get(`/logout`, authMiddleware, (req,res) => {
    res.clearCookie(`token`)
    res.redirect(`/`)
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

    } catch (error) {
        console.log(error)
    }
})

module.exports = router