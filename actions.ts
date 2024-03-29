"use server";

import { getItemsCountByExtensionInBucket } from "@/lib/aws";

export const getUserItemsCount = async (userId: string) => {
  try {
    const [imageCount, videoCount] = await Promise.all([
      getItemsCountByExtensionInBucket(userId, "jpg"),
      getItemsCountByExtensionInBucket(userId, "mp4"),
    ]);
    return {
      imageCount,
      videoCount,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
