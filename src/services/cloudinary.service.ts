import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (photo: string) => {
  if (photo === "") {
    return ""
  }
  const photoUrl = await cloudinary.uploader.upload(photo);
  return photoUrl
}

