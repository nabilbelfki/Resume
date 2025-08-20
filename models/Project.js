// /models/Project.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true, enum: ['Active', 'Inactive'] },
  duration: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  views: { type: Number, required: true },
  url: { type: String, required: true },
  thumbnail: {
    fileName: { type: String, required: false },
    path: { type: String, required: false },
    backgroundColor: { type: String, required: false },
    width: { type: Number, required: false },
    height: { type: Number, required: false }
  },
  repository: {
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
  },
  container: {
    type: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    shortUrl: {
      type: String,
      required: false,
    },
  },
  languages: [{
    name: { type: String, required: false },
    color: { type: String, required: false },
    percentage: { type: Number, required: false }
  }],
  tools: [{
    name: { type: String, required: false },
    slug: { type: String, required: false },
    url: { type: String, required: false },
    color: { type: String, required: false },
    imagePath: { type: String, required: false },
    width: { type: Number, required: false },
    height: { type: Number, required: false }
  }],
  description: { type: String, required: true },
  slug: { type: String, required: true },
  client: {
    title: {
      name: { type: String, required: true },
      fontSize: { type: Number, required: true },
    },
    logo: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      path: { type: String, required: true },
      fileName: { type: String, required: true },
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    description: { type: String, required: true },
    slides: [
      {
        name: { type: String, required: true },
        image: {
          width: { type: Number, required: true },
          height: { type: Number, required: true },
          src: { type: String, required: true },
          alt: { type: String, required: true },
          backgroundColor: { type: String, required: true },
        },
      },
    ],
  },
});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema, "project");
