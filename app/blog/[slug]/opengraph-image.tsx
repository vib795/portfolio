import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, loadOgFonts } from "@/lib/og";
import { formatPostDate, getAllPostSlugs, getPost } from "@/lib/blog";
import { profile } from "@/lib/content";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blog post";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  // generateStaticParams covers every real slug, so this only guards the
  // type — a missing post still renders a valid card rather than throwing.
  if (!post) {
    return new ImageResponse(
      <OgCard eyebrow="Writing" title={profile.name} footer="singhcodes.dev" />,
      { ...size, fonts: loadOgFonts() },
    );
  }

  return new ImageResponse(
    (
      <OgCard
        eyebrow={post.source === "medium" ? "Medium · Writing" : "Writing"}
        title={post.title}
        footer={profile.name}
        meta={`${formatPostDate(post.date)} · ${post.readingMinutes} min`}
      />
    ),
    { ...size, fonts: loadOgFonts() },
  );
}
