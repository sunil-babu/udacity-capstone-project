import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyResult } from "aws-lambda";
import { getAvailablePets } from "../../businessLogic/pets";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (): Promise<APIGatewayProxyResult> => {
    logger.info(
      `Received request for getting all available pets for a walk...`
    );

    const items = await getAvailablePets();

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
