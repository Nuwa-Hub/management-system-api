const mongoose = require("mongoose");

const ChoreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true},
    taskId: { type: String, required: true },
    
    completed: {
        type: Boolean,
        default: false,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chore", ChoreSchema);