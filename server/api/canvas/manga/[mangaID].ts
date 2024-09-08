import { createCanvas, loadImage } from "canvas";
import { send } from "h3";

function wrapText(
  ctx: any,
  text: any,
  x: any,
  y: any,
  maxWidth: any,
  lineHeight: any
) {
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
  const mangaID = getRouterParam(event, "mangaID");

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

  // Oranı koruyarak kırpma alanını hesaplama
  const scale = Math.max(targetWidth / imgWidth, targetHeight / imgHeight);
  const newWidth = imgWidth * scale;
  const newHeight = imgHeight * scale;
  const offsetX = (newWidth - targetWidth) / 2;
  const offsetY = (newHeight - targetHeight) / 2;

  // Opaklık ayarın
  ctx.globalAlpha = 0.33;

  // Arka planın üzerine arkaplan resmi ekleme (orta hizalanmış)
  ctx.drawImage(image, -offsetX, -offsetY, newWidth, newHeight);

  // Kapak resmi ayarları
  ctx.globalAlpha = 1; // Opaklığı geri döndür
  const coverWidth = 421; // Kapak genişliği
  const coverHeight = 600; // Kapak yüksekliği
  const coverX = canvas.width - coverWidth - 20; // Kapak sağda, 20px boşluk
  const coverY = canvas.height - coverHeight - 20; // Kapak altta, 20px boşluk

  // Kapak resmini çiz
  try {
    ctx.drawImage(image2, coverX, coverY, coverWidth, coverHeight);
  } catch (error) {
    console.error("Kapak resmi çizilirken bir hata oluştu:", error);
  }

  ctx.font = "bold 64px Sans"; // Başlık font ve boyut ayarı
  ctx.fillStyle = "white"; // Yazı rengi
  ctx.textAlign = "left"; // Metni sola hizala
  ctx.textBaseline = "top"; // Metni üstten hizala

  // Başlığı yaz
  const title = mangaData.data.title;
  ctx.fillText(
    title.length >= 16 ? title.substring(0, 16) + "..." : title,
    75,
    75
  ); // Başlığı sol üst köşeye (x=75, y=75) yaz

  ctx.font = "italic 32px Sans"; // Yazar adı font ve boyut ayarı
  const author = mangaData.data.authors[0]?.name || "Bilinmiyor"; // Yazar adı manga verisinden al
  ctx.fillText(author, 75, 135); // Yazar adını başlığın altına (x=75, y=135) yaz

  ctx.font = "16px Sans";
  const synopsis = mangaData.data.synopsis || "Mangaya Mangile'da göz at!";
  const maxWidth = 600; // Yazının maksimum genişliği
  const lineHeight = 24; // Satır yüksekliği

  wrapText(
    ctx,
    synopsis.length >= 750 ? synopsis.substring(0, 750) + "..." : synopsis,
    75,
    250,
    maxWidth,
    lineHeight
  );

  ctx.font = "bold 16px Sans";
  ctx.fillText("MANGILE by falsisdev", 75, 600);

  const imageData = canvas.toBuffer("image/png");

  return send(event, imageData, "image/png");
});
