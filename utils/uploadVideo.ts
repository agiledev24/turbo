import { Livepeer } from "livepeer";

const livepeer = new Livepeer({
  apiKey: "<api-key>",
});

export const uploadVideo = async (file: File) => {
  try {
    // Assuming 'file' is a File object that you want to upload
    const assetData = {
      name: file.name,
      // Add other asset properties as needed
    };

    const response = await livepeer.asset.create(assetData);
    // Implement additional logic as needed based on the response
  } catch (error) {
    console.error("Error uploading video:", error);
  }
};
