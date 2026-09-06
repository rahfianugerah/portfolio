import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes/index'
import { codeInput } from '@sanity/code-input'

export default defineConfig({
  name: 'default',
  title: 'Rahfi\'s Workspace',
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
})