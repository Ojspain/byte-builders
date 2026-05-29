import "dotenv/config";
import connectDB from "./config/db.js";
import cors from "cors";
import express from "express";
import speciesRoutes from "./routes/speciesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Mount the routes
// Any request that starts with '/api/species' is forwarded to speciesRoutes
app.use("/api/species", speciesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
