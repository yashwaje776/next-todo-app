import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Text is required"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
});

export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
