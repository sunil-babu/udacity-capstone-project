import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserPets } from "../../businessLogic/pets";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);

    logger.info(`Received request for getting all pets for user ${userId}...`);

    const items = await getUserPets(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
