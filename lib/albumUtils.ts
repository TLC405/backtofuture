/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
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
 * Renders all decades onto a high-res styled dashboard layout.
 */
export async function createAlbumImage(imageData: Record<string, string>): Promise<string> {
    const keys = Object.keys(imageData);
    // Load all images first
    const loadedImages = await Promise.all(keys.map(key => loadImage(imageData[key])));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");

    // Canvas Configuration
    const imgW = 600;
    const imgH = 337.5; // 16:9 Aspect Ratio
    const gapX = 60;
    const gapY = 120;
    const marginX = 100;
    const marginY = 100;
    const headerH = 250;
    const footerH = 150;
    
    // Layout: 3 Columns for 9 items (3x3 grid)
    const cols = 3;
    const rows = Math.ceil(keys.length / cols);
    
    const canvasW = marginX * 2 + (cols * imgW) + ((cols - 1) * gapX);
    const canvasH = headerH + (rows * imgH) + ((rows - 1) * gapY) + footerH + marginY;

    canvas.width = canvasW;
    canvas.height = canvasH;

    // --- DRAWING ---

    // 1. Background
    const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
    grad.addColorStop(0, '#0f172a'); // Slate 900
    grad.addColorStop(0.5, '#020617'); // Slate 950
    grad.addColorStop(1, '#000000'); // Black
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // 2. Tech Overlay Pattern (Grid)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let y=0; y<canvasH; y+=50) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvasW, y);
    }
    ctx.stroke();

    // 3. Header Text
    ctx.textAlign = 'center';
    
    // Title Shadow
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px "Syncopate", sans-serif';
    ctx.fillText("REWIND ARCHIVE", canvasW / 2, 140);
    ctx.shadowBlur = 0; // Reset shadow

    // Subtitle
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 36px "Rajdhani", sans-serif';
    // Canvas letterSpacing support is recent, checking existence
    if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = '10px';
    }
    ctx.fillText("TEMPORAL DISPLACEMENT LOG // CLASSIFIED", canvasW / 2, 210);
    if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = '0px';
    }

    // 4. Images Grid
    keys.forEach((decade, i) => {
        const img = loadedImages[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const x = marginX + col * (imgW + gapX);
        const y = headerH + row * (imgH + gapY);
        
        // Glow effect behind image
        ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
        ctx.shadowBlur = 30;
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, imgW, imgH);
        ctx.shadowBlur = 0;

        // Draw Image
        ctx.drawImage(img, x, y, imgW, imgH);
        
        // Draw Holographic Border
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, imgW, imgH);
        
        // Deco Corners (Cyberpunk style)
        ctx.fillStyle = '#00f0ff';
        const cornerLen = 20;
        const cornerThick = 4;
        
        // Top Left
        ctx.fillRect(x - cornerThick, y - cornerThick, cornerLen, cornerThick); 
        ctx.fillRect(x - cornerThick, y - cornerThick, cornerThick, cornerLen);
        
        // Top Right
        ctx.fillRect(x + imgW - cornerLen + cornerThick, y - cornerThick, cornerLen, cornerThick);
        ctx.fillRect(x + imgW, y - cornerThick, cornerThick, cornerLen);
        
        // Bottom Left
        ctx.fillRect(x - cornerThick, y + imgH, cornerLen, cornerThick);
        ctx.fillRect(x - cornerThick, y + imgH - cornerLen + cornerThick, cornerThick, cornerLen);
        
        // Bottom Right
        ctx.fillRect(x + imgW - cornerLen + cornerThick, y + imgH, cornerLen, cornerThick);
        ctx.fillRect(x + imgW, y + imgH - cornerLen + cornerThick, cornerThick, cornerLen);

        // Caption - Decade
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 48px "Syncopate", sans-serif';
        ctx.fillText(decade, x, y + imgH + 60);
        
        // Caption - Meta
        ctx.fillStyle = '#94a3b8'; // Slate 400
        ctx.font = '24px "Rajdhani", sans-serif';
        ctx.fillText("STATUS: RESTORED", x, y + imgH + 95);
    });

    // 5. Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#475569'; // Slate 600
    ctx.font = '30px "Rajdhani", sans-serif';
    ctx.fillText("GENERATED BY REWIND | TLC TEMPORAL LABS", canvasW / 2, canvasH - 60);

    // Return as JPEG Data URL (High Quality)
    return canvas.toDataURL('image/jpeg', 0.95);
}


/**
 * Generates a vertical 9:16 aspect ratio "Temporal Identity Card" for social media.
 */
export async function createShareableCard(userImageUrl: string, decade: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");

    // 9:16 Aspect Ratio for Instagram Stories / TikTok
    const cardW = 1080;
    const cardH = 1920;

    canvas.width = cardW;
    canvas.height = cardH;

    // Load user image
    const userImg = await loadImage(userImageUrl);

    // --- DRAWING ---

    // 1. Background: Carbon Fiber Mesh
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, cardW, cardH);
    // Dark Hex Mesh overlay
    const hexPatternCanvas = document.createElement('canvas');
    const hexCtx = hexPatternCanvas.getContext('2d');
    if (hexCtx) {
        hexPatternCanvas.width = 16;
        hexPatternCanvas.height = 16;
        hexCtx.fillStyle = '#0a0a0a';
        hexCtx.fillRect(0, 0, 16, 16);
        hexCtx.strokeStyle = '#1e293b';
        hexCtx.lineWidth = 1;
        hexCtx.beginPath();
        hexCtx.arc(8, 8, 2, 0, Math.PI * 2);
        hexCtx.stroke();
        const pattern = ctx.createPattern(hexPatternCanvas, 'repeat');
        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, cardW, cardH);
        }
    }


    // 2. Main Generated Image (framed)
    const imgFrameW = cardW * 0.9;
    const imgFrameH = imgFrameW / (16/9); // Ensure 16:9 aspect
    const imgX = cardW * 0.05;
    const imgY = cardH * 0.15;

    // Outer Glow for the image frame
    ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
    ctx.shadowBlur = 60;
    ctx.fillStyle = '#000';
    ctx.fillRect(imgX, imgY, imgFrameW, imgFrameH);
    ctx.shadowBlur = 0; // Reset shadow

    // Draw image, maintaining aspect ratio within the frame
    const imgAspectRatio = userImg.width / userImg.height;
    const frameAspectRatio = imgFrameW / imgFrameH;
    let drawW, drawH, offsetX, offsetY;

    if (imgAspectRatio > frameAspectRatio) { // Image is wider than frame
        drawW = imgFrameW;
        drawH = imgFrameW / imgAspectRatio;
        offsetX = 0;
        offsetY = (imgFrameH - drawH) / 2;
    } else { // Image is taller or same aspect as frame
        drawH = imgFrameH;
        drawW = imgFrameH * imgAspectRatio;
        offsetY = 0;
        offsetX = (imgFrameW - drawW) / 2;
    }
    
    ctx.drawImage(userImg, imgX + offsetX, imgY + offsetY, drawW, drawH);

    // Holographic Border
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = 8;
    ctx.strokeRect(imgX, imgY, imgFrameW, imgFrameH);
    
    // Deco Corners
    ctx.fillStyle = '#00f0ff';
    const cornerLen = 40;
    const cornerThick = 6;
    
    // Top Left
    ctx.fillRect(imgX - cornerThick, imgY - cornerThick, cornerLen, cornerThick); 
    ctx.fillRect(imgX - cornerThick, imgY - cornerThick, cornerThick, cornerLen);
    
    // Top Right
    ctx.fillRect(imgX + imgFrameW - cornerLen + cornerThick, imgY - cornerThick, cornerLen, cornerThick);
    ctx.fillRect(imgX + imgFrameW, imgY - cornerThick, cornerThick, cornerLen);
    
    // Bottom Left
    ctx.fillRect(imgX - cornerThick, imgY + imgFrameH, cornerLen, cornerThick);
    ctx.fillRect(imgX - cornerThick, imgY + imgFrameH - cornerLen + cornerThick, cornerThick, cornerLen);
    
    // Bottom Right
    ctx.fillRect(imgX + imgFrameW - cornerLen + cornerThick, imgY + imgFrameH, cornerLen, cornerThick);
    ctx.fillRect(imgX + imgFrameW, imgY + imgFrameH - cornerLen + cornerThick, cornerThick, cornerLen);


    // 3. REWIND Branding (Massive and Glowing)
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 80;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 160px "Syncopate", sans-serif';
    ctx.fillText("REWIND", cardW / 2, cardH * 0.08); // Top position
    ctx.shadowBlur = 0; // Reset shadow

    // 4. Temporal Data / Decade Info
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 70px "Rajdhani", sans-serif';
    if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = '10px';
    }
    ctx.fillText(decade.toUpperCase(), cardW / 2, cardH * 0.78);
    if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = '0px';
    }

    ctx.fillStyle = '#94a3b8'; // Slate 400
    ctx.font = '40px "Rajdhani", sans-serif';
    ctx.fillText("DESTINATION: " + decade.toUpperCase() + " // STATUS: STABLE", cardW / 2, cardH * 0.83);

    // 5. Marketing Hook: Barcode / "Scan to Travel"
    const barcodeH = 100;
    const barcodeY = cardH * 0.9;
    const barcodeX = cardW * 0.15;
    const barcodeW = cardW * 0.7;

    // Barcode background
    ctx.fillStyle = '#111';
    ctx.fillRect(barcodeX, barcodeY, barcodeW, barcodeH);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(barcodeX, barcodeY, barcodeW, barcodeH);

    // Barcode lines (simplified aesthetic)
    ctx.fillStyle = '#ddd';
    for (let i = 0; i < 50; i++) {
        const barWidth = Math.random() * 3 + 1;
        const barHeight = Math.random() * (barcodeH * 0.8) + (barcodeH * 0.1);
        ctx.fillRect(barcodeX + 5 + i * (barcodeW / 50), barcodeY + (barcodeH - barHeight) / 2, barWidth, barHeight);
    }

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 36px "Rajdhani", sans-serif';
    ctx.fillText("SCAN TO TRAVEL // REWINDAPP.COM", cardW / 2, barcodeY + barcodeH + 50);


    return canvas.toDataURL('image/jpeg', 0.9);
}