// Require .env as config
require(`dotenv`).config()

const connectDB = require(`./server/config/db`)
const { isActiveRoute } = require(`./server/helpers/routeHelpers`)

const methodOverride = require(`method-override`)

const express = require(`express`)
const expresslayout = require(`express-ejs-layouts`)
const cookieParser = require(`cookie-parser`)
const mongoStore = require(`connect-mongo`)
const session = require("express-session")

const app = express()
const PORT = process.env.PORT

// Connect to MongoDB
connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride(`_method`))

// Basic Session
app.use(session({
    secret: `keyboard cat`,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}))

// Public folder for js, css, images
app.use(express.static(`public`))

// Templating engine in middleware
app.use(expresslayout)
app.set(`layout`, `./layouts/main`)
app.set(`view engine`, `ejs`)

app.locals.isActiveRoute = isActiveRoute;

// For routes components
app.use(`/`, require(`./server/routes/main`))
app.use(`/`, require(`./server/routes/admin`))

// For 404 not found
app.use((req, res) => {
    const local = {
        title: `404`
    }
    res.status(404).render(`404`, { local })
})


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})

