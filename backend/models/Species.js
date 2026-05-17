// TODO: Convert the species json into a schema
import mongoose from "mongoose";

const speciesSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  },
);

const Species = mongoose.model("Species", speciesSchema);

export default Species;
