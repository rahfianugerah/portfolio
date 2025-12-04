import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes/index'
import { codeInput } from '@sanity/code-input'

export default defineConfig({
  name: 'default',
  title: 'My Portfolio Blog',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [
    structureTool(),
    codeInput() 
  ],
  schema: {
    types: schemaTypes,
  },
  // Theme configuration - auto respects system/localStorage preference
  theme: {
    // Let Studio follow system preference which syncs with main app via initStudioThemeSync
  },
})