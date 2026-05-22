import Species from "../models/Species.js";

export const getSpecies = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { speciesCommon: { $regex: search, $options: "i" } },
          { speciesActual: { $regex: search, $options: "i" } },
        ],
      };
    }
    const species = await Species.find(query).limit(search ? 20 : 0);
    res.status(200).json(species);
  } catch (error) {
    console.error("Error in getSpecies:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSpeciesByName = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const species = await Species.findOne({
      $or: [
        { speciesActual: { $regex: `^${name}$`, $options: "i" } },
        { speciesCommon: { $regex: `^${name}$`, $options: "i" } },
      ],
    });
    if (!species) {
      return res.status(404).json({ message: "Species not found" });
    }
    res.status(200).json(species);
  } catch (error) {
    console.error("Error in getSpeciesByName:", error.message);
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
