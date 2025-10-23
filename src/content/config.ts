import { z, defineCollection } from "astro:content";
const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    badge: z.string().optional(),
    tags: z.array(z.string()).refine(items => new Set(items).size === items.length, {
        message: 'tags must be unique',
    }).optional(),
});

const projectSchema = z.object({
  title: z.string(),
  description: z.string(), // This is the short summary for the card
  heroImage: z.string().optional(), // Image for the card
  badge: z.string().optional(), // e.g., "Master Thesis"
  tags: z.array(z.string()), // e.g., ["Python", "C", "EV Charging"]
  githubUrl: z.string().url().optional(), // Link to GitHub repo
  order: z.number(), // Used to sort projects (1 = first, 2 = second)
});

export type BlogSchema = z.infer<typeof blogSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>; // Added new type

const blogCollection = defineCollection({ schema: blogSchema });
const projectCollection = defineCollection({ schema: projectSchema }); // Added new collection

export const collections = {
    'blog': blogCollection,
    'project': projectCollection, // Registered the new collection
}