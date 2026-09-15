import { buildLegacyTheme, defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes/index'
import { codeInput } from '@sanity/code-input'

/**
 * Black and white, set in Google Sans, and nothing else changed.
 *
 * buildLegacyTheme returns a complete theme and takes defaults for anything not named here,
 * so only the brand accent and the two ends of the greyscale move. Success, warning and
 * danger keep Sanity's colours: a validation error that is black is a validation error
 * nobody notices.
 */
const theme = buildLegacyTheme({
  '--black': '#0a0a0a',
  '--white': '#ffffff',

  '--brand-primary': '#0a0a0a',

  '--component-bg': '#ffffff',
  '--component-text-color': '#0a0a0a',

  '--default-button-color': '#0a0a0a',
  '--default-button-primary-color': '#0a0a0a',

  // The focus ring is the field's own border rather than a second, heavier one drawn around
  // it: a clicked input should read as the same box, not a different one.
  '--focus-color': '#d8d8d8',

  // The face both sites are set in. The root layout already loads Google Sans for every route,
  // the studio included, so naming it is all the studio needs. Inter, loaded by next/font, sits
  // behind it for the moment before the stylesheet arrives.
  '--font-family-base': '"Google Sans", var(--font-sans), ui-sans-serif, system-ui, sans-serif',
})

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
  theme,
})