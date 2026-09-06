import { defineField, defineType } from 'sanity'

/**
 * A company, a university, a programme: a place, written once.
 *
 * Roles and education both point here, so an employer with three roles under it carries one
 * name and one logo instead of three copies that drift apart. The same document serves a
 * place that is both an employer and a school, which is the case for more than one of these.
 */
export default defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Uploaded once. Every role and every course here uses it.',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
  ],
  preview: { select: { title: 'name', media: 'logo' } },
})
