import { defineArrayMember, defineField, defineType } from 'sanity'

/** One school or programme. */
export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'school',
      title: 'School',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Degree or programme',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'href', title: 'Website', type: 'url' }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
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
  preview: { select: { title: 'school', subtitle: 'degree', media: 'logo' } },
})
