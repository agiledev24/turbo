require("dotenv").config();
import { videoBase64 } from "@/app/video";
import AWS from "aws-sdk";
import { decrementUserCredits } from "./dynamodb";

// Create an instance of AWS.S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  s3ForcePathStyle: true,
  // endpoint: "https://s3.amazonaws.com",
  signatureVersion: "v4",
});
const bucketName = process.env.AWS_S3_BUCKET!;

// Function to fetch user assets from S3
export const fetchUserAssetsFromS3 = async (userId: string) => {
  const prefix = `${userId}/`; // Assuming assets are stored with userId as a prefix

  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: bucketName,
    Prefix: prefix,
  };

  try {
    const response = await s3.listObjectsV2(params).promise();
    if (!response.Contents) {
      console.log("No contents found.");
      return [];
    }
    const assets = await Promise.all(
      response.Contents.filter((c) => c.Key).map(async ({ Key }) => {
        console.log("KEY", Key?.endsWith(".mp4") ? "video" : "image");
        const url = await s3.getSignedUrlPromise("getObject", {
          Bucket: bucketName,
          Key: Key,
          Expires: 3600, // URL expires in 1 hour, adjust as needed
        });

        return {
          type: Key?.endsWith(".mp4") ? "video" : "image",
          url: url, // Presigned URL
        };
      })
    );

    console.log(assets);

    return assets;

    // return response.Contents.filter(c => c.Key).map(({ Key }) => ({
    //   type: Key!.endsWith('.mp4') ? 'video' : 'image',
    //   url: `https://${bucketName}.s3.amazonaws.com/${Key}`,

    // }));
  } catch (error) {
    console.error("Error fetching user's assets from S3:", error);
    throw new Error("Failed to fetch assets");
  }
};

// Function to get the number of items with a specific file extension in a specific prefix within a bucket
export const getItemsCountByExtensionInBucket = async (
  userId: string,
  fileExtension: string
): Promise<number> => {
  // Set up the parameters for listing objects
  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: bucketName,
    Prefix: `${userId}/`, // Prefix for objects belonging to the user
  };

  try {
    // List objects in the specified prefix
    const response = await s3.listObjectsV2(params).promise();
    if (!response.Contents) {
      return 0;
    }
    // Filter objects based on file extension
    const itemsWithExtension = response.Contents
      ? response.Contents.filter(
          (item) => item && item.Key && item.Key.endsWith(`.${fileExtension}`)
        )
      : [];
    // Count the number of items with the specified extension
    const itemsCount = itemsWithExtension.length;
    return itemsCount;
  } catch (error) {
    console.error(
      `Error getting items count with extension ${fileExtension} from S3:`,
      error
    );
    throw new Error(
      `Failed to get items count with extension ${fileExtension} from S3`
    );
  }
};

// Function to upload a file to S3
export const s3Upload = async (
  fileBuffer: Buffer,
  userId: string,
  fileName: string,
  mimeType: string
) => {
  // Set up the parameters for the S3 upload
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: `${userId}/${fileName}`, // Constructing the file key
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    // Upload the file to S3
    const response = await s3.upload(params).promise();

    // const jpgCount = await getItemsCountByExtensionInBucket(userId, "jpg");
    // console.log("jpgCount", jpgCount);

    const userCreditsRes = await decrementUserCredits(userId, "image");
    console.log("dynamo", userCreditsRes?.imageCredits);

    return {
      url: response.Location, // URL of the uploaded file
      key: response.Key, // Key of the uploaded file
      jpgCount: userCreditsRes?.imageCredits, // Number of jpg files in the user's directory
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

export async function uploadVideoToS3(blob: any, userId: string) {
  const body = Buffer.from(blob, "base64");
  const fileName = `video-${Date.now()}.mp4`;
  // Set up the parameters for the S3 upload
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucketName,
    Key: `${userId}/${fileName}`, // Constructing the file key
    Body: body, // Use the blob as Body
    ContentType: "video/mp4", // Set content type accordingly
  };

  try {
    // Upload the file to S3
    const response = await s3.upload(params).promise();

    // const mp4Count = await getItemsCountByExtensionInBucket(userId, "mp4");
    const userCreditsRes = await decrementUserCredits(userId, "video");

    return {
      url: response.Location, // URL of the uploaded file
      key: response.Key, // Key of the uploaded file
      mp4Count: userCreditsRes?.videoCredits, // Number of mp4 files in the user's directory
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}
