import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  image: {
    name: { type: String, required: true },
    url: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    height: { type: Number, required: true },
    width: { type: Number, required: true },
  },
  description: {
    color: { type: String, required: true },
    text: { type: String, required: true },
    backgroundColor: { type: String, required: true },
  },
});

export default mongoose.models.Skill ||
  mongoose.model("Skill", SkillSchema, "skill");
