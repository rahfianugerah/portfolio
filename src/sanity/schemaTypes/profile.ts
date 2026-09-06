import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The site's own identity: the name, the one-line role, and the summary.
 *
 * A singleton in practice. Nothing enforces that, because a document type with exactly one
 * document is what a settings screen is, and Sanity has no cheaper way to express it than a
 * document nobody creates a second of. The query takes the first one either way.
 */
export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'initials',
      title: 'Initials',
      type: 'string',
      description: 'Shown when an avatar fails to load.',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'The one line under the name, for example "AI Software Engineer".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 8,
      description: 'The About paragraph. Markdown is rendered.',
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'locationLink', title: 'Location link', type: 'url' }),
    defineField({
      name: 'avatar',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Which icon the site draws for this link.',
              options: {
                list: [
                  { title: 'GitHub', value: 'github' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Email', value: 'email' },
                  { title: 'Document', value: 'file' },
                  { title: 'Website', value: 'globe' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'inNavbar',
              title: 'Show in the dock',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'avatar' } },
})
