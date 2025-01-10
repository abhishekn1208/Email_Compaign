const express = require("express")
const routes = express.Router()
const {loginAdmin, registerUser} = require("../collections/auth.collection")


routes.post("/register", registerUser)
routes.post("/login",loginAdmin)

module.exports = routes