// models/GalleryItem.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IGalleryItem extends Document {
  userId: string;
  type: string; // 'image' or 'video'
  url: string;
  createdAt: Date;
}

const galleryItemSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', galleryItemSchema);

export default GalleryItem;
