const express = require("express")
const routes = express.Router()
const {createCompaign,getallCompaigns,updateCompaign,deleteCompaign,sendBulkEmails,scheduleCampaign,clickrateTracking,openTracking} = require("../collections/email.compaign.collections")

//create compaign
routes.post("/create",createCompaign)

//getall compaign
routes.get("/",getallCompaigns)

//update compaign
routes.patch("/:id",updateCompaign)

//delete a compaign
routes.delete("/:id", deleteCompaign)

//send bulk email
routes.get("/sendemail/:id", sendBulkEmails)

//send bulk email at scheduled timer
routes.post("/sendemail/:id/schedule",scheduleCampaign)

//track open rate
routes.get("/track/open/:trackingId",openTracking)

//click rate
routes.get("/track/click/:trackingId",clickrateTracking)

module.exports = routes