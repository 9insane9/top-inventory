require("dotenv").config()

const express = require("express")
const app = express()
const path = require("node:path")

const categoryRouter = require("./routes/categoryRouter")
const resetRouter = require("./routes/resetRouter")
const itemRouter = require("./routes/itemRouter")
const apiRouter = require("./routes/apiRouter")
const iconRouter = require("./routes/iconRouter")

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.redirect("/categories")
})
app.use("/categories", categoryRouter)
app.use("/items", itemRouter)
app.use("/reset", resetRouter)
app.use("/api", apiRouter)
app.use("/icons", iconRouter)

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("500: Server Error")
})

app.listen(PORT, (error) => {
  if (error) {
    throw error
  }
  console.log(`Express app listening on port ${PORT}!`)
})
