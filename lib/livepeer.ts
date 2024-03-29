import fetch from 'node-fetch';
import { getAssetIdsForUser } from './dbHelpers';

interface LivepeerAsset {
  id: string;
  playbackId: string;
}

async function fetchLivepeerAssetDetails(assetId: string, apiKey: string): Promise<LivepeerAsset> {
  if (!assetId) {
    throw new Error('Asset ID is undefined or null');
  }

  if (!apiKey) {
    throw new Error('API Key is undefined or null');
  }

  const url = `https://livepeer.com/api/asset/${assetId}`;
  const headers = { 'Authorization': `Bearer ${apiKey}` };
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch asset details from Livepeer');
  }

  return response.json() as Promise<LivepeerAsset>; // Type assertion
}

export const fetchUserVideoAssets = async (userId: string) => {
  const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY!;

  if (!apiKey) {
    throw new Error('Livepeer API Key is not defined');
  }

  const assetIds = await getAssetIdsForUser(userId);
  console.log("assetIds", assetIds);

  const validAssetIds = assetIds.filter(assetId => typeof assetId === 'string'); // Filter out non-string values
  const assets = await Promise.all(validAssetIds.map((assetId: string) => fetchLivepeerAssetDetails(assetId, apiKey)));

  return assets.map(({ id, playbackId }: LivepeerAsset) => ({ id, playbackId, userId, type: 'video' }));
};

async function someFunctionToHandleAssets(userId: string) {
  try {
    const assetIds = await getAssetIdsForUser(userId);
    // Do something with the asset IDs, like fetching more details from Livepeer
  } catch (error) {
    console.error('Error fetching asset IDs:', error);
    // Handle the error appropriately
  }
}
