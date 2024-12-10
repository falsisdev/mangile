import { createCanvas, loadImage } from "canvas";
import { send } from "h3";

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth) {
      ctx.fillText(line, x, lineY);
      line = word + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, lineY);
}

export default defineEventHandler(async (event) => {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext("2d");
  const mangaID = getRouterParam(event, "titleID");

  const mangaData = await fetch(
    `https://api.jikan.moe/v4/manga/${mangaID}/full`
  ).then((response) => response.json());

  const imageUrl = mangaData.data.images.jpg.large_image_url;
  const image = await loadImage(imageUrl); // Arka plan
  const image2 = await loadImage(imageUrl); // Kapak

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Resmi kırpma
  const { width: imgWidth, height: imgHeight } = image;
  const targetWidth = 1200;
  const targetHeight = 630;

  const scale = Math.max(targetWidth / imgWidth, targetHeight / imgHeight);
  const newWidth = imgWidth * scale;
  const newHeight = imgHeight * scale;
  const offsetX = (newWidth - targetWidth) / 2;
  const offsetY = (newHeight - targetHeight) / 2;

  ctx.globalAlpha = 0.33;
  ctx.drawImage(image, -offsetX, -offsetY, newWidth, newHeight);

  ctx.globalAlpha = 1;
  const coverWidth = 421;
  const coverHeight = 600;
  const coverX = canvas.width - coverWidth - 20;
  const coverY = canvas.height - coverHeight - 20;

  try {
    ctx.drawImage(image2, coverX, coverY, coverWidth, coverHeight);
  } catch (error) {
    console.error("Kapak resmi çizilirken bir hata oluştu:", error);
  }

  // Varsayılan fontlardan birini kullan
  ctx.font = "bold 64px sans-serif"; // sans-serif sistem fontu
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const title = mangaData.data.title;
  ctx.fillText(
    title.length >= 16 ? title.substring(0, 16) + "..." : title,
    75,
    75
  );

  ctx.font = "italic 32px sans-serif"; // sans-serif sistem fontu
  const author = mangaData.data.authors[0]?.name || "Bilinmiyor";
  ctx.fillText(author, 75, 135);

  ctx.font = "16px sans-serif"; // sans-serif sistem fontu
  const synopsis = mangaData.data.synopsis || "Mangaya Mangile'da göz at!";
  const maxWidth = 600;
  const lineHeight = 24;

  wrapText(
    ctx,
    synopsis.length >= 750 ? synopsis.substring(0, 750) + "..." : synopsis,
    75,
    250,
    maxWidth,
    lineHeight
  );

  ctx.font = "bold 16px sans-serif";
  ctx.fillText("MANGILE by falsisdev", 75, 600);

  const imageData = canvas.toBuffer("image/png");

  return send(event, imageData, "image/png");
});