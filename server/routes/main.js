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
router.get(``, async (req, res) => {
    try {
        const local = {
            title: `Personal blog with Nodejs`,
            desc: `Building a blog with Node, Express and MongoDB`
        }

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
        let slug = req.params.id
        const data = await Post.findById({ _id: slug })

        const local = {
            title: data.title,
        }

        res.render(`post`, { local, data })

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

router.use((req, res) => {
    res.status(400).render(`404`)
})

module.exports = router

// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "This is title",
//             body: "Building blog with NodeJs"
//         },
//         {
//             title: "This is title2",
//             body: "Building blog with NodeJs 2"
//         },
//         {
//             title: "This is title 3",
//             body: "Building blog with NodeJs 3"
//         },
//         {
//             title: "This is title 4",
//             body: "Building blog with NodeJs 4"
//         },
//         {
//             title: "This is title 5",
//             body: "Building blog with NodeJs 5"
//         },
//         {
//             title: "This is title 6",
//             body: "Building blog with NodeJs 6"
//         },
//         {
//             title: "This is title 7",
//             body: "Building blog with NodeJs 7"
//         },
//         {
//             title: "This is title 8",
//             body: "Building blog with NodeJs 8"
//         },
//         {
//             title: "This is title 9",
//             body: "Building blog with NodeJs 9"
//         },
//         {
//             title: "This is title 10",
//             body: "Building blog with NodeJs 10"
//         },
//         {
//             title: "This is title 11",
//             body: "Building blog with NodeJs 11"
//         },
//         {
//             title: "This is title 12",
//             body: "Building blog with NodeJs 12"
//         },
//     ])
// }

// insertPostData()

