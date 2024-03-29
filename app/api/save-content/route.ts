// Import statements remain unchanged
import { s3Upload, uploadVideoToS3 } from "@/lib/aws";
import { incrementUserCredits } from "@/lib/dynamodb";
import { NextRequest } from "next/server";
import fetch from "node-fetch";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, imageUrl, isVideo } = body;
  let fileBuffer;
  let s3Response;
  console.log("IMAGEURL", imageUrl);

  // try {
  //   // Validate input
  //   if (!userId || !imageUrl || !/^https?:\/\//i.test(imageUrl)) {
  //     return new Response(
  //       JSON.stringify({ error: "Missing required fields or invalid URL" }),
  //       {
  //         status: 400,
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //   }
  // } catch (error) {
  //   console.error("Error in save-content route -> Validate input:", error);
  //   return new Response(
  //     JSON.stringify({ error: "Internal Server Error", message: error }),
  //     {
  //       // Corrected this line
  //       status: 500,
  //       headers: { "Content-Type": "application/json" },
  //     }
  //   );
  // }
  if (!isVideo) {
    try {
      // Fetch the image or video
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      fileBuffer = await response.buffer();
    } catch (error) {
      console.error(
        "Error in save-content route -> Fetch the image or video:",
        error
      );
      return new Response(
        JSON.stringify({ error: "Internal Server Error", message: error }),
        {
          // Corrected this line
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Upload to S3 and save to database
      s3Response = await s3Upload(
        fileBuffer,
        userId,
        `image-${Date.now()}.jpg`,
        "image/jpeg"
      );

      return new Response(JSON.stringify(s3Response), { status: 200 });
    } catch (error) {
      console.error(
        "Error in save-content route -> Upload to S3 and save to database:",
        error
      );
      return new Response(
        JSON.stringify({ error: "Internal Server Error", message: error }),
        {
          // Corrected this line
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    try {
      const res = await uploadVideoToS3(imageUrl, userId);

      return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Internal Server Error", message: error }),
        {
          // Corrected this line
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
