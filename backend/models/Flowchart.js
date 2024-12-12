
const mongoose = require("mongoose");

const flowchartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nodes: {
      type: [String], // Array of strings (node names)
      required: true,
    },
    edges: [
      {
        from: {
          type: String, // From node name
          required: true,
        },
        to: {
          type: String, // To node name
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Flowchart = mongoose.model("Flowchart", flowchartSchema);

module.exports = Flowchart;
