import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { nanoid } from "nanoid";
import { storage } from "./clientApp";

export async function uploadProfileImageToFirebase(file: File, userId: string) {
  const id = nanoid();
  const uploadPath = `profile_pictures/${userId}/${id}`;
  const storageRef = ref(storage, uploadPath);
  try {
    if (!file) return;
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(ref(storageRef));
    return url;
  } catch (error) {
    console.log(error);
  }
}

export const deleteProfileImage = async (imageUrl: string) => {
  try {
    // Extract the storage path from the URL
    const storagePath = decodeURIComponent(
      imageUrl.split("/o/")[1].split("?alt=media")[0]
    );

    const imageRef = ref(storage, storagePath);

    await deleteObject(imageRef);
    return true;
  } catch (error) {
    return false;
  }
};
