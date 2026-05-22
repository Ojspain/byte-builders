import express from "express";
import { getSpecies, getSpeciesByName, getSpeciesById } from "../controllers/speciesController.js";

const router = express.Router();

router.get("/", getSpecies);
router.get("/name/:name", getSpeciesByName);
router.get("/:id", getSpeciesById);

export default router;
