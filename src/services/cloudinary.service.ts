import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import { isURL, isValid } from '../utilities/common';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


export const uploadMedia = async (file: any) => {
  try {
    if (typeof (file) === 'object') {
      return file
    }
    if (!file) {
      return undefined
    }
    if (isURL(file)) {
      return undefined
    }
    const uploaded = await cloudinary.uploader.upload(file);
    return {
      id: uploaded.public_id,
      url: uploaded.secure_url
    }
  } catch (error: any) {
    throw new Error(error);
  }
}


export const deleteMedia = async (id?: string | null) => {
  try {
    if (!id) {
      return false
    }
    await cloudinary.uploader.destroy(id);
    return true
  } catch (error: any) {
    throw new Error(error);
  }
}

export const uploadMultipleMedia = async (files: string[]) => {

  const links = []
  if (isValid(files) && files?.length === 0) {
    return []
  }
  for (const link of files) {
    if (isValid(link) && !isURL(link)) {
      const data = await uploadMedia(link)
      links.push(data)
    }
  }
  return links.filter(x => isValid(x))
}