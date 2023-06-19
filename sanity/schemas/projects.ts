export default {
  name: 'project',
  type: 'document',
  title: 'Project',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'order',
      type: 'number',
      title: 'Order',
      validation: (Rule: any) =>
        Rule.integer().greaterThan(0).warning(`The order should be a positive integer.`),
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
    },
    {
      name: 'description',
      type: 'object',
      title: 'Description',
      fields: [
        {
          name: 'en',
          type: 'text',
          title: 'English',
        },
        {
          name: 'fr',
          type: 'text',
          title: 'French',
        },
      ],
    },
    {
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule: any) => Rule.min(2).max(4).warning(`There should be 2-4 technonogies.`),
    },
    {
      name: 'github',
      title: 'Github',
      type: 'string',
    },
    {
      name: 'url',
      title: 'Url',
      type: 'string',
    },
    {
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          name: 'video',
          type: 'file',
          fields: [
            {
              name: 'name',
              type: 'object',
              title: 'Name',
              fields: [
                {
                  name: 'en',
                  type: 'string',
                  title: 'English',
                },
                {
                  name: 'fr',
                  type: 'string',
                  title: 'French',
                },
              ],
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.length(3).warning(`There should be exactly 3 videos.`),
    },
  ],
}
