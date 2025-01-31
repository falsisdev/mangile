import { defineEventHandler } from "h3";
import { useSanity } from "#imports";
import imageUrlBuilder from "@sanity/image-url";

interface Chapter {
  chapterNumber: number;
  source: string;
}

interface Manga {
  relations?: { relation: string; entry: { mal_id: number; type: string }[] }[];
  images?: { jpg: { large_image_url: string } };
}

interface JikanResponse<T> {
  data: T;
}

export default defineEventHandler(async (event) => {
  const { titleID } = event.context.params as { titleID?: string };
  if (!titleID) {
    return { response: "error", message: "titleID is required" };
  }

  try {
    const sanity: any = useSanity();
    const builder = imageUrlBuilder(sanity.config);
    const getSanityImageUrl = (source: any) => builder.image(source).url();
    const query = `*[_type == "manga" && myAnimeListId == $titleID][0]`;
    const sanityData = await sanity.fetch(query, { titleID: Number(titleID) });

    const sanityDataWithImages = sanityData?.chapters
      ? {
          ...sanityData,
          chapters: sanityData.chapters.map((chapter: any) => ({
            ...chapter,
            pages: chapter.pages
              ? chapter.pages.map((page: any) => getSanityImageUrl(page))
              : [],
          })),
        }
      : sanityData;

    let groupedChapters: Chapter[][] = [];
    let unGroupedChapters: Chapter[] = [];
    let scans: string[] = [];

    if (sanityData?.chapters) {
      unGroupedChapters = sanityData.chapters;
      groupedChapters = Object.values(
        unGroupedChapters.reduce<Record<number, Chapter[]>>((acc, chapter) => {
          acc[chapter.chapterNumber] = acc[chapter.chapterNumber] || [];
          acc[chapter.chapterNumber].push(chapter);
          return acc;
        }, {})
      );
      scans = unGroupedChapters.map((chap) => chap.source);
    }

    // Jikan API istekleri
    const [mangaRes, imagesRes, recommendationsRes] = await Promise.all([
      fetch(`https://api.jikan.moe/v4/manga/${titleID}/full`).then((res) =>
        res.json()
      ) as Promise<JikanResponse<Manga>>,
      fetch(`https://api.jikan.moe/v4/manga/${titleID}/pictures`).then((res) =>
        res.json()
      ) as Promise<JikanResponse<{ jpg: { large_image_url: string } }[]>>,
      fetch(`https://api.jikan.moe/v4/manga/${titleID}/recommendations`).then(
        (res) => res.json()
      ) as Promise<JikanResponse<unknown[]>>,
    ]);

    const manga: Manga = mangaRes.data || {};
    const images = imagesRes.data || [];
    const recommendations = recommendationsRes.data || [];

    // İlişkili mangaları çekme
    let relations: { relation: string; entry: Manga }[] = [];
    if (manga.relations) {
      relations = await Promise.all(
        manga.relations.flatMap((relation) =>
          relation.entry
            .filter((entry) => entry.type === "manga")
            .map(async (entry) => {
              const entryData = (await fetch(
                `https://api.jikan.moe/v4/manga/${entry.mal_id}/full`
              ).then((res) => res.json())) as JikanResponse<Manga>;
              return { relation: relation.relation, entry: entryData.data };
            })
        )
      );
    }

    return {
      response: "ok.",
      sanityData: sanityDataWithImages,
      groupedChapters,
      unGroupedChapters,
      scans,
      manga,
      images,
      recommendations,
      relations,
    };
  } catch (error) {
    return { response: "error", message: (error as Error).message };
  }
});
