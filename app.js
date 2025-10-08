require("dotenv").config

const express = require("express")
const app = express()
const path = require("node:path")
//import routers

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000

//// routers
// app.use("/", routerNameHere)

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
