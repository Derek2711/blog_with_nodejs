const express = require(`express`);
const router = express.Router();
const Post = require("../models/Post");

// Logging
const morgan = require(`morgan`);

router.use(morgan(`dev`));
router.use(express.urlencoded({ extended: true }))

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


router.get(`/about`, (req, res) => {
    res.render(`about`, { local })
})

router.get(`/contact`, (req, res) => {
    res.render(`contact`, { local })
})

router.use((req, res) => {
    const local = {
        title: `404`
    }
    res.status(404).render(`404`, { local })
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

