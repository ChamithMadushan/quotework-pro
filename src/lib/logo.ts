const MAX_BYTES = 750_000;
const MAX_EDGE = 720;

export async function fileToLogoDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a PNG, JPG, or SVG image.');
  }
  if (file.size > 4_000_000) {
    throw new Error('Logo file must be 4 MB or smaller.');
  }

  const dataUrl = await readFile(file);
  if (file.type === 'image/svg+xml') return dataUrl;
  return resizeImage(dataUrl);
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.readAsDataURL(file);
  });
}

function resizeImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not process that image.'));
        return;
      }
      ctx.drawImage(image, 0, 0, width, height);
      let quality = 0.86;
      let result = canvas.toDataURL('image/jpeg', quality);
      while (result.length > MAX_BYTES && quality > 0.5) {
        quality -= 0.08;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(result);
    };
    image.onerror = () => reject(new Error('Could not process that image.'));
    image.src = dataUrl;
  });
}
