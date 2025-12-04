// src/sanity/lib/image.ts
import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export const urlFor = (source: any) => {
  return builder.image(source)
}