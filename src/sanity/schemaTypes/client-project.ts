import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * An engagement on the consulting site, edited from this studio.
 *
 * It lives in this schema rather than in the consulting repository because there is one
 * studio and one dataset for both sites. The consulting site reads these documents over the
 * public GROQ endpoint and needs no Sanity client of its own to do it.
 */
export default defineType({
  name: 'clientProject',
  title: 'Client Engagement',
  type: 'document',
  fields: [
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'sector', title: 'Sector', type: 'string' }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'A year or a range, written the way it should read.',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      description: "What the engagement set out to solve, in the client's terms.",
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome',
      type: 'text',
      rows: 2,
      description: 'The measurable result the client agreed to.',
    }),
    defineField({
      name: 'image',
      title: 'Preview Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'client', subtitle: 'sector', media: 'image' } },
})
