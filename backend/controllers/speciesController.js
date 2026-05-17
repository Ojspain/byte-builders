import Species from "../models/Species.js";

export const getSpecies = async (req, res) => {
  try {
    // TODO: Write the Mongoose query to return all species in the database

    res.status(200).json({ message: "" });
  } catch (error) {
    console.error("Error in getSpecies:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSpeciesById = async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Write the Mongoose query to find a species by its ID

    res.status(200).json({ message: `` });
  } catch (error) {
    console.error("Error in getSpeciesById:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add more controller functions here as needed (e.g., createSpecies, updateSpecies)
