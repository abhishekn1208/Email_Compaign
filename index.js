const express = require("express")
require('dotenv').config()
const app = express()
const PORT = process.env.PORT
const MongoConnect = require("./Config/db")
const UserRouter = require("./Router/auth.router")
const CompaignRouter = require("./Router/email.compaign.router")
app.use(express.json())
const cors = require('cors');

app.use(cors());
app.use("/api",CompaignRouter)
app.use("/api",UserRouter)
app.get("/health",(req,res)=>{
    res.send("OK")
})

app.listen(PORT,async()=>{
    await MongoConnect()
    console.log(`App is listening on the PORT : ${PORT}`)
})