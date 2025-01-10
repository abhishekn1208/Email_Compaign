  const transporter = require("../Config/transporter");
  const Compaign = require("../model/email.comaign.model");
  const cron = require("node-cron");

  const createCompaign = async (req, res) => {
    try {
      // console.log(req.body)
      const newCompaign = new Compaign({ ...req.body });

      await newCompaign.save();
      res.status(200).json(newCompaign);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const getallCompaigns = async (req, res) => {
    try {
      const compaign = await Compaign.find();

      res.status(200).json(compaign);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

const getSpecificCompaign=async(req,res)=>{
  try {
    const compaign = await Compaign.findById(req.params.id)
  if(!compaign) return res.status(404).json({message : "Not found"})

    res.status(200).json(compaign)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}


  const updateCompaign = async (req, res) => {
    try {
      const compaign = await Compaign.findById(req.params.id);

      if (!compaign)
        return res.status(404).json({ message: "Compaign not found" });

      const newCompaign = await Compaign.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      await newCompaign.save()
      res.status(200).json({ message: "Updated Successfully", newCompaign });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const deleteCompaign = async (req, res) => {
    try {

      const compaign = await Compaign.findById(req.params.id);
      if (!compaign)
        return res.status(404).json({ message: "Compaign not found" });

      const deletedCompaign = await Compaign.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const sendBulkEmails = async (compaignId) => {
    try {
      
      const compaign = await Compaign.findById(compaignId);

      if (!compaign)
        return res.status(404).json({ message: "Compaign not found" });
      const generateTrackingId = () => {
        return Math.random().toString(36).substr(2, 9);
      };
      const { subject, emailContent, recipients } = compaign;


      const mailOptions = {
        from: '"Abhishek 👻" <abhi@gmail.com>',
        subject: subject,
        text: emailContent,
        html: `<b>${emailContent}</b>
         ${recipients.map((recipient) => {
          const trackingId = generateTrackingId();
      const trackingPixelUrl = `http://localhost:3000/track/open/${trackingId}`;
      const link = `http://localhost:3000/track/click/${trackingId}?redirectUrl=${"http://localhost:5173/"}&_=${new Date().getTime()}`;
      return `
      <a href="${link}">Click Here</a><br />
      <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" />
    `;
  }).join('')}
        `,
      };

      const sendEmailPromises = recipients.map(async(recipient) => {
       try {
        const result =  transporter.sendMail({
          ...mailOptions,
          to: recipient,
        });
        compaign.deliverySuccess += 1;
        return result
       } catch (error) {
        compaign.deliveryFailed += 1;
        console.error("Error sending email to ", recipient, error);
       }
      });
      const results = await Promise.all(sendEmailPromises);


      compaign.totalEmailsSent = recipients.length;
   
      await compaign.save()
      console.log("All emails sent successfully", results);
      return results;

    } catch (error) {
      console.error("Error sending bulk emails:", error);
    }
  };

  const scheduleCampaign = async (req, res) => {
    try {
      const compaign = await Compaign.findById(req.params.id);
      if (!compaign)
        return res.status(404).json({ message: "Compaign not found" });
     
      const { scheduledAt } = compaign;
      if (!scheduledAt) {
        console.log("Scheduling not mentioned. Sending emails immediately.");
        await sendBulkEmails(req.params.id);
        return res.status(200).json({ message: "Emails sent immediately" });
      }
      if (!scheduledAt)
        return res.status(404).json({ message: "Scheduling not mentioned" });

      const currentTime = new Date()
      const scheduledTime = new Date(scheduledAt)

      const delay = scheduledTime - currentTime
        if (delay <= 0) {
      return res.status(400).json({ message: "Scheduled time must be in the future" });
    }

      console.log(`The emails will be send in ${delay} miliseconds`)
      const compaignId = req.params.id
      console.log(compaignId)
      setTimeout(async()=>{
       await sendBulkEmails(compaignId)
       console.log("sent")
      },delay)

      res.status(200).json({ message: `Compaign scheduled at ${scheduledAt}` });
    } catch (error) {
     
        return res.status(500).json({ message: "Internal Server Error" });
      
    }
  };

  const openTracking=async(req,res)=>{
    try {
      const compaign = await Compaign.findOne({"recipients.trackingId" : req.params.trackingId})
    if(!compaign) return res.status(404).json({message : "Compaign not found"})

      compaign.openRate +=1;
      await compaign.save()

      res.setHeader('Content-Type', 'image/png');
      const buffer = Buffer.from([0, 0, 0, 0, 0, 0]); 
      res.send(buffer);
    } catch (error) {
      console.error('Error tracking open:', error);
      res.sendStatus(500);
    }


  }

  const clickrateTracking=async(req,res)=>{
    try {
      const { trackingId } = req.params; 
      const { redirectUrl } = req.query;  
  
      // Log the click event
      const campaign = await Compaign.findOne({ "recipients.trackingId": trackingId });
  
      if (campaign) {
        // Increment click count for the campaign or recipient
        campaign.clickRate += 1;  // You can also track clicks per recipient if needed
        await campaign.save();
      }
  
      // Redirect to the actual destination URL
      res.redirect(redirectUrl);
  
    } catch (error) {
      console.error('Error tracking click:', error);
      res.sendStatus(500);
    }
  }


  module.exports = {
    createCompaign,
    getallCompaigns,
    updateCompaign,
    deleteCompaign,
    sendBulkEmails,
    scheduleCampaign,
    openTracking,
    clickrateTracking,
    getSpecificCompaign
  };
