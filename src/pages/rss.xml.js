import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
import createSlug from "../lib/createSlug"; // 1. IMPORT THE createSlug FUNCTION

export async function GET(context) {
  const blog = await getCollection("blog");

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site, // 2. USE context.site (more robust than import.meta.env)
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // 3. USE createSlug TO BUILD THE CORRECT LINK
      link: `/blog/${createSlug(post.data.title, post.slug)}/`, 
    })),
  });
}