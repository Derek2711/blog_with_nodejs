// Require .env as config
require(`dotenv`).config()

const router = require(`./server/routes/main`)
const connectDB = require(`./server/config/db`)

const express = require(`express`)
const expresslayout = require(`express-ejs-layouts`)

const app = express()
// || Port for production in server
const PORT = 8000 || process.env.PORT

// Connect to MongoDB
connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Public folder for js, css, images
app.use(express.static(`public`))

// Templating engine in middleware
app.use(expresslayout)
app.set(`layout`, `./layouts/main`)
app.set(`view engine`, `ejs`)

// For routes components
app.use(`/`, router)

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})

