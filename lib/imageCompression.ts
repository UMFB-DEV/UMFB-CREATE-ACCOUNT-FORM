export async function compressImage(file: File, maxWidth: number = 1200, maxHeight: number = 1200, quality: number = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    // Skip compression for non-image files (like PDFs)
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          // Fallback to original file if canvas is not available
          resolve(file);
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output type (default to JPEG for best compression)
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create new compressed file
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, `.${outputType.split('/')[1]}`), {
                type: outputType,
                lastModified: Date.now(),
              });
              console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(1)} KB → ${(compressedFile.size / 1024).toFixed(1)} KB`);
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          outputType,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = () => reject(new Error('Failed to read file for compression'));
  });
}
