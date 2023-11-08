const express = require(`express`);
const router = express.Router();
const Post = require("../models/Post");

// Logging
const morgan = require(`morgan`);

router.use(morgan(`dev`));

/**
 * GET/
 * Home
 */
const local = {
    title: `Personal blog with Nodejs`,
    desc: `Building a blog with Node, Express and MongoDB`
}

router.get(``, async (req, res) => {
    try {

        /* ---Get All Post with Pagination--- */
        const perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage)

        res.render(`index`, {
            local,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            previousPage: page - 1
        });
        /* ----------- */

    } catch (error) {
        console.log(`ERROR : ${error}`)
    }
});


/**
 * GET/
 * Post : _id
 */

router.get(`/post/:id`, async (req, res) => {
    try {
        let id = req.params.id
        const data = await Post.findById(id)

        const local = {
            title: data.title,
        }

        res.render(`detail`, { local, data })

    } catch (error) {
        console.log(`ERROR : ${error}`)
    }

});

/**
 * POST/
 * Post : Search
 */
router.post(`/search`, async (req, res) => {
    try {
        const local = {
            title: `Search`,
        }
        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

        // Search from database
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, `i`) } },
                { body: { $regex: new RegExp(searchNoSpecialChar, `i`) } },
            ]
        })
        res.render(`search`, { data, local })
    } catch (error) {
        console.log(error)
    }
})





router.get(`/about`, (req, res) => {
    res.render(`about`, { local })
})

router.get(`/contact`, (req, res) => {
    res.render(`contact`, { local })
})



module.exports = router