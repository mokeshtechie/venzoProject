const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://mokeshramadoss1202:foP0SlhVgvB94Inl@feedback.dtaiaau.mongodb.net/FeedBack?retryWrites=true&w=majority&appName=FeedBack")
  .then(() => {
    console.log("✅ Connected to database");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("❌ Connection failed");
  });
  app.get('/', (req, res) => {
  res.send('Hello – your server is online!')
})
const feedbackSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  status: String,
  upvotes: { type: Number, default: 0 },
  comments: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
app.post("/feedbacks", async (req, res) => {
  try {
    const entry = new Feedback(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/feedbacks", async (req, res) => {
  const data = await Feedback.find();
  res.json(data);
});
app.get("/feedbacks/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const fb = await Feedback.findById(id);
    if (!fb) return res.status(404).json({ error: "Not found" });
    res.json(fb);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/feedbacks", async (req, res) => {
  try {
    const entry = new Feedback(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.patch("/feedbacks/:id/upvote", async (req, res) => {
  const updated = await Feedback.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );
  res.json(updated);
});
