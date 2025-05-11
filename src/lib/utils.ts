import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from 'react-toastify'
import imageCompression from "browser-image-compression";

type ToastMessageProps = {
  message: string
  type: 'error' | 'success' | 'warning' | 'info'
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toastMessage = ({ message, type }: ToastMessageProps) => {
  toast(message, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    type: type,
  })
}

export async function compressFiles(files: File[]) {
  const compressPromisses = files.map(async (file) => {
    try {
      return await compressImage(file);
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  return (await Promise.all(compressPromisses)).filter((file) => file !== null);
}
export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const options = {
      maxSizeMB: 0.2, // 200KB
      maxWidthOrHeight: 900,
      useWebWorker: true,
      fileType: "image/png",
    };
    imageCompression(file, options).then((compressedFile) => {
      resolve(compressedFile);
    });
  });
};

export function formatUrl(url: string) {
  const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
  return formattedUrl;
}

export function triggerImageInput(id: string) {
  document.getElementById(id)?.click();
}
export function handleImageInput(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0] ?? null;
  if (file) {
    const imageURL = URL.createObjectURL(file);
    return imageURL;
  }
  return null;
}