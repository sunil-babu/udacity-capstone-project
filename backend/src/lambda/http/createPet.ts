import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CreatePetRequest } from "../../requests/CreatePetRequest";
import { getUserId } from "../utils";
import { createPet } from "../../businessLogic/pets";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newPet: CreatePetRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    logger.info(`Received request for creating pet for user ${userId}...`);

    const item = await createPet(newPet, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
