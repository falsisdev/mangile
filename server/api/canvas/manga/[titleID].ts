import { createCanvas, loadImage, registerFont } from "canvas";
import { send } from "h3";
import path from "path";

registerFont(
  path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf"),
  {
    family: "Roboto",
    weight: "normal",
  }
);
registerFont(path.join(process.cwd(), "public", "fonts", "Roboto-Bold.ttf"), {
  family: "Roboto",
  weight: "bold",
});
registerFont(path.join(process.cwd(), "public", "fonts", "Roboto-Italic.ttf"), {
  family: "Roboto",
  style: "italic",
});

function wrapText(
  ctx: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, lineY);
      line = words[i] + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line.trim(), x, lineY);
  }
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

  ctx.font = "bold 64px Roboto";
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const title = mangaData.data.title;
  ctx.fillText(
    title.length >= 16 ? title.substring(0, 16) + "..." : title,
    75,
    75
  );

  ctx.font = "italic 32px Roboto";
  const author = mangaData.data.authors[0]?.name || "Bilinmiyor";
  ctx.fillText(author, 75, 135);

  ctx.font = "16px Roboto";
  const synopsis = mangaData.data.synopsis || "Mangaya Mangile'da göz at!";
  const maxWidth = 600;
  const lineHeight = 24;

  wrapText(
    ctx,
    synopsis.length >= 500 ? synopsis.substring(0, 500) + "..." : synopsis,
    75,
    250,
    maxWidth,
    lineHeight
  );

  ctx.font = "bold 16px Roboto";
  ctx.fillText("mangile.vercel.app | created by falsisdev", 75, 600);

  const imageData = canvas.toBuffer("image/png");

  return send(event, imageData, "image/png");
});
