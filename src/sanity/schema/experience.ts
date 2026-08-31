import { defineType, defineField } from 'sanity';

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'host',
      title: 'Host',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({
          name: 'photo',
          title: 'Photo',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'startDate',
      title: 'Departure date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      description:
        'The day the trip departs. Drives everything — a trip disappears from the ' +
        'site automatically once this date has passed, so stale departures can never ' +
        'be shown. Required.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dates',
      title: 'Dates (display text)',
      type: 'string',
      description:
        'How the dates are shown to visitors, e.g. "May 15-22, 2027". This is just ' +
        'a label — keep it consistent with the departure date above.',
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      options: {
        list: [
          { title: 'Scotland', value: 'Scotland' },
          { title: 'Ireland', value: 'Ireland' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Open', value: 'open' },
          { title: 'Limited', value: 'limited' },
          { title: 'Sold Out', value: 'sold_out' },
        ],
        layout: 'radio',
      },
      initialValue: 'open',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g. "From $14,500 CAD"',
    }),
    defineField({
      name: 'spotsRemaining',
      title: 'Spots Remaining',
      type: 'number',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'boolean',
      description:
        'A trip promoted before the details exist. The card links to the contact page instead of a detail page, because there is nothing to detail yet.',
      initialValue: false,
    }),
    defineField({
      name: 'datesTbc',
      title: 'Dates To Be Confirmed',
      type: 'boolean',
      description:
        'Tick when Start Date is only a sort key and not a real departure. Cards then show the Dates label and never a specific date.',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'destination',
      media: 'image',
    },
  },
});
