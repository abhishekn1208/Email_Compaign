const express = require("express")
const routes = express.Router()
const {loginAdmin} = require("../collections/login.collection")
const auth = require("../middleware/auth")


routes.post("/login",loginAdmin)

module.exports = routes