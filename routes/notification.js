const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
  const router = require("express").Router();
  const Notification = require("../models/Notification");

  //CREATE
router.post("/", async (req, res) => {
    const newNotification = new Notification(req.body);
  
    try {
      const savedNotification = await newNotification.save();
      res.status(200).json(savedNotification);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get Notification by user id
router.get("/:id", async (req, res) => {
    try {
      const Notifications = await Notification.find({ receiverId: req.params.id });
      res.status(200).json(Notifications);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //DELETE Notification
router.delete("/:taskId/:receiverId",  async (req, res) => {
    try {
      
      const deleteNotification = await Notification.deleteMany({taskId:req.params.taskId,receiverId:req.params.receiverId});
      res.status(200).json();
    } catch (err) {
      console.log("err");
      res.status(500).json(err);
    }
  });
  
  module.exports = router;