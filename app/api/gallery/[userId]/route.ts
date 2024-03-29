import { NextRequest, NextResponse } from "next/server";
import { fetchUserAssetsFromS3 } from "@/lib/aws";
import { fetchUserVideoAssets } from "@/lib/livepeer";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.pathname.split("/").pop() || "";

  try {
    // Fetch assets from AWS S3 and categorize them as images
    const s3Items = (await fetchUserAssetsFromS3(userId)).map((item) => ({
      ...item,
    }));
    console.log("s3Items >>", s3Items);

    // Fetch video assets from Livepeer and categorize them as videos
    const livepeerItems = (await fetchUserVideoAssets(userId)).map((item) => ({
      ...item,
      type: "video",
    }));
    console.log("livepeerItems >>", livepeerItems);

    // Combine S3 and Livepeer items
    const items = [...s3Items, ...livepeerItems];

    if (items.length === 0) {
      // If the user has no assets, return a message
      return new NextResponse(
        JSON.stringify({ message: "You have no visuals. Go create some!" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the categorized items
    return new NextResponse(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user's assets:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch assets" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
