
async function resizeImage(imagePath) {
    return new Promise((resolve, reject) => {
        const originalImage = new Image();
        originalImage.crossOrigin="anonymous"
        originalImage.src = imagePath;

        const canvas = document.createElement('canvas');
        canvas.style.display = "none"

        const ctx = canvas.getContext('2d');

        originalImage.addEventListener('load', function() {
            const originalWidth = originalImage.naturalWidth;
            const originalHeight = originalImage.naturalHeight;

            const max = Math.max(originalWidth, originalHeight);
            canvas.width = max;
            canvas.height = max;

            const dx = (max - originalWidth)/2;
            const dy = (max - originalHeight)/2;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(originalImage, dx, dy, max - 2*dx, max - 2*dy);

            resolve(canvas.toDataURL("image/png", 0.9))
        });
    });
}