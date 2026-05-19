import mongoose from "mongoose";

//Define the schema for the species collection
const speciesSchema = new mongoose.Schema(
  {
    speciesCommon: String,
    speciesActual: String,
    Kingdom: String,
    Phylum: String,
    Class: String,
    Order: String,
    Family: String,
    Genus: String,
    Species: String,
    Size: String,
    Colors: String,
    Descriptors: String,
    Category: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

//Convert the species json into a schema
const Species = mongoose.model("Species", speciesSchema);

export default Species;
