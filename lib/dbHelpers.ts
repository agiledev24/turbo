// In lib/dbHelpers.js or similar
import { connectToDatabase } from './mongodb';

export async function getAssetIdsForUser(userId: string): Promise<string[]> {
  const { db } = await connectToDatabase();
  const documents = await db.collection('visuals').find({ userId, source: 'Livepeer' }).toArray();
  return documents.map(doc => doc.livepeerAssetId);
}
