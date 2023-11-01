const express = require(`express`)
const router = express.Router()
const Post = require("../models/Post")


/**
 * GET/
 * Home
 */
router.get(``, async (req, res) => {
    try {
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
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            previousPage : page -1
        });

    } catch (error) {
        console.log(`ERROR : ${error}`)
    }
});










router.get(`/about`, (req, res) => {
    res.render(`about`)
})

router.get(`/contact`, (req, res) => {
    res.render(`contact`)
})


// function insertPostData() {
//     post.insertMany([
//         {
//             title: "This is title",
//             body: "Building blog with NodeJs"
//         },
//         {
//             title: "This is title2",
//             body: "Building blog with NodeJs 2"
//         },
//     ])
// }

// insertPostData()

module.exports = router
