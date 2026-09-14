const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["event", "appointment", "task"],
      default: "task",
    },
    date: {
      // Stored as YYYY-MM-DD so day-lookups are simple string matches
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String, // optional "HH:MM", omitted for all-day items
      default: "",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

eventSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("Event", eventSchema);
