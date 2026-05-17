import express from "express";
import {
  getSpecies,
  getSpeciesById,
} from "../controllers/speciesController.js";

const router = express.Router();

// Map the GET request at the root (/api/species) to the getSpecies controller
router.get("/", getSpecies);

// Map the GET request with an ID parameter to the getSpeciesById controller
router.get("/:id", getSpeciesById);

export default router;
