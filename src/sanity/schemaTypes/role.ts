import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * One position: a job or a leadership role.
 *
 * These were two lists in the resume data with byte-identical shapes, so they are one
 * document type separated by `kind`. Splitting them again would mean two schemas to keep in
 * step and two queries that differ only in a filter.
 *
 * `end` is left empty for a position still held, rather than carrying the word "Present".
 * The renderer decides what to print, so the word appears in one place instead of once per
 * document, and sorting does not have to special-case a string that is not a date.
 */
export default defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Work', value: 'work' },
          { title: 'Leadership', value: 'leadership' },
        ],
        layout: 'radio',
      },
      initialValue: 'work',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'reference',
      to: [{ type: 'organization' }],
      description: 'The place. Its name and logo live there, so they are written once.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Position',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name: 'start',
      title: 'Start',
      type: 'string',
      description: 'Written the way it should read, for example "Sep 2025".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'End',
      type: 'string',
      description: 'Leave empty for a position still held.',
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'description',
      title: 'What The Role Covered',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'One line per point.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Low numbers first. Most recent position first.',
      initialValue: 100,
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'organization.name', media: 'organization.logo' } },
})
