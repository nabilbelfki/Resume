import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true }
});

const ContentBlockSchema = new mongoose.Schema({
  tag: { type: String, required: true, enum: ["p", "h1", "h2", "h3", "h4", "h5", "h6"] },
  text: { type: String, required: true }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: Number, required: true },
  views: { type: Number, required: true, default: 0 },
  category: { 
    type: String, 
    required: true
  },
  status: { 
    type: String, 
    required: true,
    enum: ["Draft", "Published", "Archived"]
  },
  comments: { type: [CommentSchema], default: [] },
  content: { type: [ContentBlockSchema], required: true },
  featuredImage: {
    url: { type: String },
    altText: { type: String }
  },
  slug: { type: String, required: true, unique: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
PostSchema.index({ title: 'text', author: 'text', category: 1, status: 1 });

// Middleware to update the updatedAt field before saving
PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema, "posts");