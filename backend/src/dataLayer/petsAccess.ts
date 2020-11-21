import * as AWS from "aws-sdk";
// import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { PetItem } from "../models/PetItem";
import { createLogger } from "../utils/logger";

const logger = createLogger("auth");

// const XAWS = AWSXRay.captureAWS(AWS);

export class PetAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly petsTable = process.env.PETS_TABLE,
    private readonly avaibleIndex = process.env.AVAILABLE_INDEX,
    private readonly bucketName = process.env.PETS_IMAGES_S3_BUCKET
  ) {}

  async getAvailablePets(): Promise<PetItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.petsTable,
        IndexName: this.avaibleIndex,
        KeyConditionExpression: "available = :available",
        ExpressionAttributeValues: {
          ":available": "true",
        },
      })
      .promise();

    logger.info(`Found ${result.Count} available pets for walking`);

    const items = result.Items;

    return items as PetItem[];
  }

  async getUserPets(userId: string): Promise<PetItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.petsTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    logger.info(`Found ${result.Count} available pets for user ${userId}`);

    const items = result.Items;

    return items as PetItem[];
  }

  async createPet(pet: PetItem): Promise<PetItem> {
    await this.docClient
      .put({
        TableName: this.petsTable,
        Item: pet,
      })
      .promise();

    logger.info(`Saved new pet ${pet.petId} for user ${pet.userId}`);

    return pet;
  }

  async walkPet(userId: string, petId: string) {
    await this.docClient
      .update({
        TableName: this.petsTable,
        Key: {
          userId,
          petId,
        },
        UpdateExpression: "set #available = :available",
        ExpressionAttributeValues: {
          ":available": "false",
        },
        ExpressionAttributeNames: {
          "#available": "available",
        },
      })
      .promise();
  }

  async availablePet(userId: string, petId: string) {
    await this.docClient
      .update({
        TableName: this.petsTable,
        Key: {
          userId,
          petId,
        },
        UpdateExpression: "set #available = :available",
        ExpressionAttributeValues: {
          ":available": "true",
        },
        ExpressionAttributeNames: {
          "#available": "available",
        },
      })
      .promise();
  }

  async deletePet(userId: string, petId: string) {
    await this.docClient
      .delete({
        TableName: this.petsTable,
        Key: {
          userId,
          petId,
        },
      })
      .promise();

    logger.info(`Deleted pet ${petId}`);
  }

  async updateUrl(userId: string, petId: string) {
    await this.docClient
      .update({
        TableName: this.petsTable,
        Key: {
          userId,
          petId,
        },
        UpdateExpression: "set #attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${petId}`,
        },
        ExpressionAttributeNames: {
          "#attachmentUrl": "attachmentUrl",
        },
      })
      .promise();
  }
}
