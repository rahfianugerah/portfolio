import { defineField, defineType } from 'sanity'

/**
 * The title, the description and the visible heading of one route.
 *
 * Every page used to spell these out in its own file, so changing a heading was a commit.
 * They are documents keyed by route now, and a page that has no document falls back to what
 * it always said, so adding one is optional rather than a prerequisite.
 */
export default defineType({
  name: 'pageMeta',
  title: 'Page Metadata',
  type: 'document',
  fields: [
    defineField({
      name: 'route',
      title: 'Route',
      type: 'string',
      description: 'The path exactly as it appears in the address bar, for example /project.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^\/[a-z0-9/-]*$/, { name: 'a path starting with a slash' }),
    }),
    defineField({
      name: 'title',
      title: 'Browser Title',
      type: 'string',
      description: 'Shown in the tab and in search results, before the site name.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'The one sentence search engines and link previews show.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description:
        'The visible title on the page. The accent punctuation is added by the site, so write "Projects" rather than "Rahfi\'s | Projects."',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      description: 'The paragraph under the heading.',
    }),
  ],
  preview: { select: { title: 'route', subtitle: 'title' } },
})
