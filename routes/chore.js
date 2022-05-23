const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
const Chore = require("../models/Chore");

//CREATE
router.post("/", async (req, res) => {
  const newChore = new Chore(req.body);

  try {
    const savedChore = await newChore.save();
    res.status(200).json(savedChore);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get chore by task id
router.get("/:id", async (req, res) => {
  try {
    const Chores = await Chore.find({ taskId: req.params.id }).sort({ _id: -1 });
    res.status(200).json(Chores);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPADATE CHORE
router.put("/:id",  async (req, res) => {
  try {
    const updateChore = await Chore.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateChore);
  } catch (err) {
    console.log("err");
    res.status(500).json(err);
  }
});
//DELETE CHORE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deleteChore = await Chore.findByIdAndDelete(req.params.id);
    res.status(200).json();
  } catch (err) {
    console.log("err");
    res.status(500).json(err);
  }
});

//delete chore by task id
router.delete("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deleteChores = await Task.remove({taskId:req.params.id});
    res.status(200).json();
  } catch (err) {
    console.log("err");
    res.status(500).json(err);
  }
});
module.exports = router;
