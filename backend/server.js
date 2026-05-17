import express from "express";
import speciesRoutes from "./routes/speciesRoutes.js";

const app = express();

app.use(express.json());

// TODO: Connect to the database
// connectDB();

// Mount the routes
// Any request that starts with '/api/species' is forwarded to speciesRoutes
app.use("/api/species", speciesRoutes);

// Other routes will go here as they are created. For example:
// app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
