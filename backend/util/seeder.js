import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// ES module path workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
import connectDB from "../config/db.js";
import Species from "../models/Species.js";

await connectDB();

const importData = async () => {
  try {
    // read from the json
    const dataPath = path.join(
      __dirname,
      "../../frontend/src/species_with_descriptions.json",
    );
    const dummyData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // clear existing test data
    await Species.deleteMany();

    // map through the species and skip _id, Colors, and Descriptors
    const speciesToInsert = dummyData.species.map((bug) => {
      const { _id, Colors, Descriptors, ...rest } = bug;
      return rest;
    });

    // insert to the db
    await Species.insertMany(speciesToInsert);

    console.log("Species data successfully imported!");
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

importData();
