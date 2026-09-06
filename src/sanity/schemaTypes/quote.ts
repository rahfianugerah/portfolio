import { defineField, defineType } from 'sanity'

/** One quotation in the home page carousel, with the portrait behind it. */
export default defineType({
  name: 'quote',
  title: 'Quote',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Quotation',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Shown under the name, for example "CEO, NVIDIA".',
    }),
    defineField({
      name: 'image',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'author', subtitle: 'role', media: 'image' } },
})
