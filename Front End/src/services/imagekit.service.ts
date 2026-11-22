import { upload } from "@imagekit/javascript";
import { apiFetch } from "../utils/api";

interface ImageKitAuth {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
}

type UploadFolder = "highlights" | "avatars";

export const uploadImage = async (file: File, folder: UploadFolder) => {
  const auth = await apiFetch<ImageKitAuth>(
    `${import.meta.env.VITE_API_URL}/imagekit/auth`,
  );

  const result = await upload({
    file,
    fileName: file.name,

    token: auth.data.token,
    expire: auth.data.expire,
    signature: auth.data.signature,
    publicKey: auth.data.publicKey,

    folder: `/axion/${folder}`,
    useUniqueFileName: true,
    isPrivateFile: false,
  });

  return result;
};
