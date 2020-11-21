import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createLogger } from "../../utils/logger";
import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import * as AWSXRay from "aws-xray-sdk";
import { getUserId } from "../utils";
import { updateUrl } from "../../businessLogic/pets";

const logger = createLogger("auth");

const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
  signatureVersion: "v4",
});

const bucketName = process.env.PETS_IMAGES_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

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

    logger.info(`Received request for generating signed URL for pet ${petId}`);

    logger.info("Geting signed URL for pet...");

    await updateUrl(userId, petId);

    const url = getUploadUrl(petId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);

function getUploadUrl(petId: string) {
  return s3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: petId,
    Expires: urlExpiration,
  });
}
