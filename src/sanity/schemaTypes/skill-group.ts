import { defineArrayMember, defineField, defineType } from 'sanity'

/** One column of the tech stack card: a heading and the technologies under it. */
export default defineType({
  name: 'skillGroup',
  title: 'Skill Group',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Group',
      type: 'string',
      description: 'For example "Languages" or "Frameworks".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Technologies',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'title' } },
})
