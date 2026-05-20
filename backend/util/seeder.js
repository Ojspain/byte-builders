import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import Species from "../models/Species.js";

dotenv.config();
connectDB();

// ES module path workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importData = async () => {
  try {
    // read from the json
    const dataPath = path.join(__dirname, "../../frontend/src/dummy_db.json");
    const dummyData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // clear existing test data
    await Species.deleteMany();

    // map through the species
    const speciesToInsert = dummyData.species.map((bug) => {
      const { _id, ...rest } = bug;
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
