// Helper function to load an image and return it as an HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error(`Failed to load image: ${src.substring(0, 50)}...`));
        img.src = src;
    });
}

/**
 * Creates a single "premium image" archive using HTML5 Canvas.
 * No longer used in main flow but kept for future "download all" features.
 */
export async function createAlbumImage(imageData: Record<string, string>): Promise<string> {
    const canvas = document.createElement('canvas');
    // ... implementation for album image generation
    return canvas.toDataURL('image/jpeg', 0.95);
}


/**
 * Generates a vertical 9:16 aspect ratio "Temporal Identity Card" for social media.
 */
export async function createShareableCard(userImageUrl: string, decade: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");

    const cardW = 1080;
    const cardH = 1920;

    canvas.width = cardW;
    canvas.height = cardH;

    const userImg = await loadImage(userImageUrl);

    // 1. Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, cardH);
    gradient.addColorStop(0, '#1a1423');
    gradient.addColorStop(1, '#0d0b14');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cardW, cardH);

    // 2. Main Image
    const imgMargin = 60;
    const imgFrameW = cardW - (imgMargin * 2);
    const imgFrameH = imgFrameW / (16/10); // Match aspect ratio of lab view
    const imgX = imgMargin;
    const imgY = cardH * 0.25;
    ctx.drawImage(userImg, imgX, imgY, imgFrameW, imgFrameH);
    ctx.strokeStyle = '#D84DFF';
    ctx.lineWidth = 4;
    ctx.strokeRect(imgX, imgY, imgFrameW, imgFrameH);
    
    // 3. Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D84DFF';
    ctx.font = 'bold 120px "Space Grotesk", sans-serif';
    ctx.fillText("REWIND", cardW / 2, 200);
    
    // 4. Data
    ctx.fillStyle = '#FFB800';
    ctx.font = '80px "Space Grotesk", sans-serif';
    ctx.fillText(decade.toUpperCase(), cardW / 2, imgY + imgFrameH + 150);

    // 5. Barcode / Footer
    ctx.fillStyle = '#374151';
    ctx.fillRect(imgMargin, cardH - 300, imgFrameW, 80);
    ctx.fillStyle = 'white';
    ctx.font = '30px "Inter", sans-serif';
    ctx.fillText("SCAN TO TRAVEL // TLC STUDIOS", cardW / 2, cardH - 150);

    return canvas.toDataURL('image/jpeg', 0.9);
}
