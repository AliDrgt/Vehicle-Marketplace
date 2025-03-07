import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const popularBrands = new Set([
    "TOYOTA", "HONDA", "FORD", "CHEVROLET", "VOLKSWAGEN", "NISSAN", "HYUNDAI", "KIA", "MAZDA", "SUBARU",
    "BMW", "MERCEDES-BENZ", "AUDI", "PORSCHE", "JAGUAR", "LAND ROVER", "VOLVO", "ALFA ROMEO", "MASERATI",
    "FERRARI", "LAMBORGHINI", "BENTLEY", "ASTON MARTIN", "ROLLS-ROYCE", "CHRYSLER", "DODGE", "JEEP", "RAM",
    "GMC", "CADILLAC", "BUICK", "LINCOLN", "TESLA", "LUCID", "LEXUS", "ACURA", "INFINITI", "GENESIS",
    "PEUGEOT", "RENAULT", "CITROËN", "FIAT", "LANCIA", "BYD", "GEELY", "GREAT WALL", "NIO", "XPENG",
    "CHERY", "MG", "ROEWE", "MINI", "SUZUKI", "MITSUBISHI", "SEAT", "SKODA", "OPEL", "VAUXHALL"
  ]);

async function fetchAndStoreCarBrands() {
    try {
      console.log("Fetching car brands from NHTSA API...");
      const response = await axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json");
  
      if (!response.data.Results) return;
  
    const brands = response.data.Results
        .map((brand: { Make_ID: number; Make_Name: string }) => ({
        id: brand.Make_ID,
        name: brand.Make_Name.trim().toUpperCase(),
    }))
    .filter((brand: { id: number; name: string }) => popularBrands.has(brand.name));  // Ensures only whitelisted brands are stored
  
      console.log(`Filtered down to ${brands.length} brands.`);
  
      for (const brand of brands) {
        await prisma.carBrand.upsert({
          where: { id: brand.id },
          update: {},
          create: brand,
        });
      }
  
      console.log("✅ Popular car brands successfully stored!");
    } catch (error) {
      console.error("Error fetching car brands:", error);
    }
}
  

async function fetchAndStoreCarModels() {
    try {
      console.log("Fetching car models for each brand...");
      const brands = await prisma.carBrand.findMany();
  
      for (const brand of brands) {
        // Ensure the exact name from the API is used
        const formattedBrandName = encodeURIComponent(brand.name.trim());
  
        console.log(`Fetching models for brand: ${brand.name} (${brand.id}) → API Name: ${formattedBrandName}`);
  
        const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${formattedBrandName}?format=json`);
  
        if (!response.data.Results || response.data.Results.length === 0) {
          console.warn(`No models found for brand ${brand.name}. Keeping in database.`);
          continue;
        }
  
        const models = response.data.Results.map((model: any) => ({
          id: model.Model_ID,
          name: model.Model_Name,
          brandId: brand.id,
        }));
  
        for (const model of models) {
          await prisma.carModel.upsert({
            where: { id: model.id },
            update: {},
            create: model,
          });
        }
  
        console.log(`Stored ${models.length} models for ${brand.name}`);
      }
  
      console.log("All valid car models successfully stored!");
    } catch (error) {
      console.error("Error fetching car models:", error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  

(async () => {
  await fetchAndStoreCarBrands();
  await fetchAndStoreCarModels();
})();
