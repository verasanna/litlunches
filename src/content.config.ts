import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  blog: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: ({ image: contentImage }) =>
      z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        image: contentImage().optional(),
        type: z.enum(['post', 'recipe']).default('post'),
        prepTime: z.string().optional(),
        cookTime: z.string().optional(),
        recipeYield: z.string().optional(),
        recipeCategory: z.string().optional(),
        recipeCuisine: z.string().optional(),
        ingredients: z.array(z.string()).optional(),
        instructions: z.array(z.string()).optional(),
      }),
  }),
};
