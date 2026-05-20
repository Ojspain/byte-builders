import Species from "../models/Species.js";

export const getSpecies = async (req, res) => {
  try {
    const species = await Species.find();
    res.status(200).json(species);
  } catch (error) {
    console.error("Error in getSpecies:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSpeciesById = async (req, res) => {
  try {
    const { id } = req.params;
    const species = await Species.findById(id);
    if (!species) {
      return res.status(404).json({ message: "Species not found" });
    }
    res.status(200).json(species);
  } catch (error) {
    console.error("Error in getSpeciesById:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add more controller functions here as needed (e.g., createSpecies, updateSpecies)
