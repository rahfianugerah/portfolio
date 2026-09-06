import { defineCliConfig } from 'sanity/cli'

/**
 * Where the CLI finds the project.
 *
 * `sanity.config.ts` configures the studio that renders at /studio; the CLI does not read it
 * for this, so without this file `dataset import` has no project to import into and asks for
 * one. The values are the same public identifiers the site uses, read from the environment
 * rather than committed.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
})
