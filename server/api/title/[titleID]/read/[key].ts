import { defineEventHandler } from "h3";
import { useSanity } from "#imports";
import imageUrlBuilder from "@sanity/image-url";

interface Chapter {
  chapterNumber: number;
  source: string;
  pages: { image: string }[];
}

export default defineEventHandler(async (event: any) => {
  const { titleID } = event.context.params as { titleID?: string };
  if (!titleID) {
    return { response: "error", message: "titleID is required" };
  }

  try {
    const sanity: any = useSanity();
    const builder = imageUrlBuilder(sanity.config);
    const getSanityImageUrl = (source: any) => builder.image(source).url();
    const query = `*[_type == "manga" && myAnimeListId == $titleID][0]`;
    const preSanityData = await sanity.fetch(query, {
      titleID: Number(titleID),
    });

    if (!preSanityData) {
      return {
        response: "error",
        message: "No data found for the given titleID",
      };
    }

    const chapter = preSanityData.chapters.find(
      (x: any) => x._key === event.context.params.key
    );

    if (!chapter) {
      return { response: "error", message: "Chapter not found" };
    }

    const updatedPages = chapter.pages.map((page: any) => ({
      image: getSanityImageUrl(page.asset._ref),
    }));

    return {
      response: "ok.",
      chapter: {
        ...chapter,
        pages: updatedPages,
      },
    };
  } catch (error) {
    return { response: "error", message: (error as Error).message };
  }
});
