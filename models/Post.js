import mongoose from "mongoose";

const Comment = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true }
});

const Item = new mongoose.Schema({
  text: { type: String, required: true },
  checked: { type: Boolean, required: false },
  marginLeft: { type: Number, required: false },
});

const Cell = new mongoose.Schema({
  text: {
    value: { type: String, required: true },
    family: { type: String, required: true },
    size: { type: Number, required: true },
    weight: { type: Number, required: true },
    color: { type: String, required: true },
    textAlign: { type: String, required: true, enum: ['left', 'center', 'right'] },
  },
  color: { type: String, required: true },
  padding: { type: Number, required: true },
  border: {
    type: { type: String, required: true, enum: ['solid', 'dashed'] },
    dash: { type: Number, required: true },
    color: { type: String, required: true },
    sides: {
      top: { type: Boolean, required: true },
      left: { type: Boolean, required: true },
      right: { type: Boolean, required: true },
      bottom: { type: Boolean, required: true },
    },
    thickness: { type: Number, required: true },
    radius: {
      topLeft: { type: Number, required: true },
      topRight: { type: Number, required: true },
      bottomLeft: { type: Number, required: true },
      bottomRight: { type: Number, required: true },
    }
  }
})

const Record = new mongoose.Schema({
  cells: { type: [Cell], required: true }
})

const Content = new mongoose.Schema({
  tag: { type: String, required: true, enum: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "ul", "image", "video", "audio", "quote", "warning", "table", "checkbox", "delimiter"] },
  text: { type: String, required: false },
  textAlign: { type: String, required: false, enum: ["left", "center", "right"] },
  items: { type: [Item], required: false },
  source: { type: String, required: false },
  extension: { type: String, required: false },
  color: { type: String, required: false },
  type: { type: String, required: false, enum: ["solid", "dashed"] },
  thickness: { type: Number, required: false },
  dashLength: { type: Number, required: false },
  records: { type: [Record], required: false },
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: Number, required: true },
  views: { type: Number, required: true, default: 0 },
  author: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  category: { 
    type: String, 
    required: true
  },
  status: { 
    type: String, 
    required: true,
    enum: ["Draft", "Published", "Archived"]
  },
  comments: { type: [Comment], default: [] },
  content: { type: [Content], default: []},
  thumbnail: {
    url: { type: String },
  },
  banner: {
    url: { type: String },
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