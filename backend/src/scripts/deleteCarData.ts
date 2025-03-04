import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteCarData() {
  await prisma.carModel.deleteMany({});
  await prisma.carBrand.deleteMany({});
  console.log("All car brands and models deleted.");
  await prisma.$disconnect();
}

deleteCarData();
