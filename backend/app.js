import cors from "cors";
import express from "express";
import speciesRoutes from "./routes/speciesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reactionRoutes from "./routes/reactionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Mount the routes
// Any request that starts with '/api/species' is forwarded to speciesRoutes, etc
app.use("/api/species", speciesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reactions", reactionRoutes);

export default app;
