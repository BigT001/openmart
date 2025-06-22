import imageCompression from 'browser-image-compression';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function compressAndUploadImage(file: File): Promise<string> {
  // Compress image
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.5, // ~500KB
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  });

  // Prepare form data
  const formData = new FormData();
  formData.append('file', compressed, compressed.name);

  // Upload to backend
  const res = await fetch(`${API_URL}/api/products/upload-image`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.url; // The URL to use in product.images
}
