const ICON_SIZE = 128;

/*
 * Server icons are stored next to the server record in localStorage, so an
 * uploaded picture is scaled down to a small square (centre cropped) instead of
 * keeping the original file size.
 */
export const readIconFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    const fail = (message: string) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(message));
    };

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = ICON_SIZE;
      canvas.height = ICON_SIZE;
      const context = canvas.getContext("2d");
      if (!context) {
        fail("Canvas is not available");
        return;
      }
      const side = Math.min(image.width, image.height);
      context.drawImage(
        image,
        (image.width - side) / 2,
        (image.height - side) / 2,
        side,
        side,
        0,
        0,
        ICON_SIZE,
        ICON_SIZE,
      );
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => fail("Unsupported image");

    image.src = objectUrl;
  });
