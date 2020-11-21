import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../utils";
import { deletePet } from "../../businessLogic/pets";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const petId = event.pathParameters.petId;
    const userId = getUserId(event);

    if (!petId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing petId" }),
      };
    }

    logger.info(
      `Received request for deleting pet ${petId} of user ${userId}...`
    );

    await deletePet(userId, petId);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
