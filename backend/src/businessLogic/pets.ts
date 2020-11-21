import { CreatePetRequest } from "./../requests/CreatePetRequest";
import * as uuid from "uuid";
import { PetItem } from "../models/PetItem";
import { PetAccess } from "../dataLayer/petsAccess";
import { createLogger } from "../utils/logger";

const logger = createLogger("auth");

const petAccess = new PetAccess();

export async function getAvailablePets(): Promise<PetItem[]> {
  return await petAccess.getAvailablePets();
}

export async function getUserPets(userId: string): Promise<PetItem[]> {
  return await petAccess.getUserPets(userId);
}

export async function createPet(
  createPetRequest: CreatePetRequest,
  userId: string
): Promise<PetItem> {
  logger.info("Generating uuid...");

  const itemId = uuid.v4();

  return await petAccess.createPet({
    available: "true",
    createdAt: new Date().toISOString(),
    userId,
    petId: itemId,
    name: createPetRequest.name,
    description: createPetRequest.description,
  });
}

export async function walkPet(userId: string, petId: string) {
  return await petAccess.walkPet(userId, petId);
}

export async function availablePet(userId: string, petId: string) {
  return await petAccess.availablePet(userId, petId);
}

export async function deletePet(userId: string, petId: string) {
  return await petAccess.deletePet(userId, petId);
}

export async function updateUrl(userId: string, petId: string) {
  await petAccess.updateUrl(userId, petId);
}
