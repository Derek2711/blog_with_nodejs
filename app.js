// Require .env as config
require(`dotenv`).config()

const express = require(`express`)
const expresslayout = require(`express-ejs-layouts`)

const connectDB = require(`./server/config/db`)

const app = express()
// || Port for production in server
const PORT = 8000 || process.env.PORT

// Connect to MongoDB
connectDB()

// Public folder for js, css, images
app.use(express.static(`public`))

// Templating engine in middleware
app.use(expresslayout)
app.set(`layout`, `./layouts/main`)
app.set(`view engine`, `ejs`)

// For routes components
app.use(`/`, require(`./server/routes/main`))

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})

