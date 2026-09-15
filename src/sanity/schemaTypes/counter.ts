import { defineField, defineType } from 'sanity'

/**
 * One figure in the consulting site's track record, such as the number of clients served.
 *
 * Typed in rather than counted from client project documents, because most past clients will
 * never get a written case study, and a count of case studies would understate the work. The
 * site shows these in order, and hides the section entirely while there are none.
 */
export default defineType({
  name: 'counter',
  title: 'Counter',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'What the number counts, for example Clients served.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'Shown right after the number, for example +.',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'label', value: 'value', suffix: 'suffix' },
    prepare: ({ title, value, suffix }) => ({
      title,
      subtitle: `${value ?? 0}${suffix ?? ''}`,
    }),
  },
})
