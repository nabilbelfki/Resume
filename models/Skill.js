// /models/Skill.js
import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  backgroundColor: { type: String, required: true },
  height: { type: Number, required: true },
  logoPath: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.Skill ||
  mongoose.model("Skill", SkillSchema, "skill");
