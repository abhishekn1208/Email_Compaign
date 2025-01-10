const express = require("express")
const routes = express.Router()
const {createCompaign,getallCompaigns,updateCompaign,deleteCompaign,getSpecificCompaign,scheduleCampaign,clickrateTracking,openTracking} = require("../collections/email.compaign.collections")
const CanAccess = require("../middleware/CanAccess")
const auth = require("../middleware/auth")

//create compaign
routes.post("/create",auth,CanAccess("admin"),createCompaign)

//getall compaign
routes.get("/",getallCompaigns)

//get Specific compaign
routes.get("/:id", getSpecificCompaign)

//update compaign
routes.patch("/:id",auth,CanAccess("admin"),updateCompaign)

//delete a compaign
routes.delete("/:id",auth,CanAccess("admin"), deleteCompaign)


//send bulk email at scheduled timer
routes.post("/sendemail/:id/schedule",scheduleCampaign)

//track open rate
routes.get("/track/open/:trackingId",openTracking)

//click rate
routes.get("/track/click/:trackingId",clickrateTracking)

module.exports = routes