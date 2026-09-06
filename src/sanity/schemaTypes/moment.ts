import { defineField, defineType } from 'sanity'

/**
 * One photograph in the moments carousel on the home page.
 *
 * Previously four raw GitHub URLs hard-coded in image-carousel.tsx, which meant changing a
 * picture was a commit and a deploy. Upload here instead.
 */
export default defineType({
  name: 'moment',
  title: 'Moment',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Photograph',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'What the photograph shows, for anyone who cannot see it.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional. Shown over the image.',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'alt', subtitle: 'caption', media: 'image' } },
})
