import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A certificate. `certifications` and `learning_certificate` in the resume data were the
 * same shape split by a comment, so they are one document type separated by `kind`.
 *
 * A certificate is reachable two ways. Upload the PDF and the project page renders it
 * inline; give a URL instead, for something that only exists on an issuer's site such as a
 * Credly badge, and the page links out to it. Setting both is allowed and the file wins.
 */
export default defineType({
  name: 'certificate',
  title: 'Certificate',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issued By',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Professional Certification', value: 'professional' },
          { title: 'Course Completion', value: 'learning' },
        ],
        layout: 'radio',
      },
      initialValue: 'professional',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'file',
      title: 'Certificate PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
      description: 'Uploaded here, the certificate is readable on the page itself.',
    }),
    defineField({
      name: 'externalUrl',
      title: 'Certificate URL',
      type: 'url',
      description:
        'For a certificate that lives on the issuer’s site. Used when no PDF is uploaded.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'issuer' },
  },
})
