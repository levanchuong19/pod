/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../components/config/firebase";


const uploadFile = async (file: any) => {
  console.log(file);
  const storageRef = ref(storage, file.name);
  const response = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(response.ref);
  return downloadURL;
};
export default uploadFile;
