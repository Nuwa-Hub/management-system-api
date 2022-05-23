const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
const Project = require("../models/Project");

//UPADATE PROJECT
router.put("/:id",  async (req, res) => {
  try {
    const updateProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateProject);
  } catch (err) {
    console.log("err");
    res.status(500).json(err);
  }
});
//DELETE PROJECT
router.delete("/:id",  async (req, res) => {
  try {
    const deleteeProject = await Project.findByIdAndDelete(req.params.id);
    res.status(200).json();
  } catch (err) {
    console.log("err");
    res.status(500).json(err);
  }
});

//CREATE
router.post("/", async (req, res) => {
  const newProject = new Project(req.body);

  try {
    const savedProject = await newProject.save();
    res.status(200).json(savedProject);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Project by projectid
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PROJECTS
router.get("/check/:id", async (req, res) => {
  try {
    const Projects = await Project.find({ managerId: req.params.id });
    res.status(200).json(Projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const Projects = await Project.find();
    res.status(200).json(Projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS

router.get("/stats", async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await Project.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
     {$sort: {_id: 1}}
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});
//UPADATE PROJECT
// router.put("/:id",verifyTokenAndAuthorization, async (req, res) => {
//   try {
//     const updateProject = await Project.findByIdAndUpdate(
//       req.params.id,
//       {$set:req.body},
//       {new:true}
//       );
//     res.status(200).json(updateProject);
//   } catch (err) {
//     console.log("err")
//     res.status(500).json(err);
//   }
// })
//DELETE PROJECT
// router.delete("/:id",verifyTokenAndAuthorization, async (req, res) => {
//   try {
//     const deleteProject = await Project.findByIdAndDelete(req.params.id);
//     res.status(200).json(deleteProject);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// })

module.exports = router;
