import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A project, previously an entry in src/data/resume.tsx.
 *
 * The one thing that could not travel from there is the `icon` on each link, which held a
 * React element and so was not serialisable. It is replaced by `type`, a discriminator the
 * renderer maps back to a component. That is the whole reason this content could not live
 * in a database before.
 */
export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Maintained, Archived, In Progress, and so on.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'image',
      title: 'Preview Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown on the project page. Landscape reads best.',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Preview Image URL',
      type: 'url',
      description:
        'Only for an image hosted elsewhere. If the field above is set, it wins.',
    }),
    defineField({
      name: 'video',
      title: 'Preview Video URL',
      type: 'url',
      description: 'Plays in place of the image when set.',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'What the button says, for example "Source" or "Forked Source".',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Source Code', value: 'github' },
                  { title: 'Website', value: 'globe' },
                ],
                layout: 'radio',
              },
              initialValue: 'github',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Low numbers first. Ties fall back to the title.',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: 'Manual Order',
      name: 'manual',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'image' },
  },
})
