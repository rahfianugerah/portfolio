import { defineArrayMember, defineField, defineType } from 'sanity'

/** One school or programme. */
export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'organisation',
      title: 'Organisation',
      type: 'reference',
      to: [{ type: 'organisation' }],
      description: 'The school. Shared with any role held at the same place.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Degree Or Programme',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'start',
      title: 'Start',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'End',
      type: 'string',
      description: 'Leave empty while still studying.',
    }),
    defineField({
      name: 'description',
      title: 'Detail',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'One line per point.',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'organisation.name', subtitle: 'degree', media: 'organisation.logo' } },
})
