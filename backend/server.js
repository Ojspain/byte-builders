import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cors from "cors";
import express from "express";
import speciesRoutes from "./routes/speciesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// TODO: Connect to the database
// connectDB();

// Mount the routes
// Any request that starts with '/api/species' is forwarded to speciesRoutes
app.use("/api/species", speciesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
