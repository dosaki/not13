export const quarterImageToFull = (imgLocation) => {
    const image = new Image();
    image.src = imgLocation;
    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
        
            canvas.width = image.width * 2;
            canvas.height = image.height * 2;

            // top-left
            ctx.drawImage(image, 0, 0);

            // top-right
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(image, -image.width * 2, 0);
            ctx.restore();

            // bottom-left
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(image, 0, -image.height * 2);
            ctx.restore();

            // bottom-right
            ctx.save();
            ctx.scale(-1, -1);
            ctx.drawImage(image, -image.width * 2, -image.height * 2);
            ctx.restore();

            resolve(canvas.toDataURL());
        };
        image.onerror = reject;
    });
};