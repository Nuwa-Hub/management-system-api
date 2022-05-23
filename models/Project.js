const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    projectname: { type: String, required: true },
    managerId: { type: String, required: true },
    companyname: { type: String, required: true },
    progress: { type: Number, required: true ,default:0},
    status: { type: String, required: true, default:"processing"},
    description: { type: String},
    tasks: [
      {
        taskId: {
          type: String,
        },
      },
    ],
    duedate: {
        type: Date,
        min: '2000-09-28',
        max: '2030-05-23'
      },
    developers: [
      {
        developerId: {
            type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
