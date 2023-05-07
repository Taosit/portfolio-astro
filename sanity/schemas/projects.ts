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
      type: 'text',
      title: 'Description',
      validation: (Rule: any) =>
        Rule.min(180).max(250).warning(`The description should be between 180 and 250 characters.`),
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
      of: [{name: 'video', type: 'file', fields: [{name: 'name', type: 'string', title: 'Name'}]}],
      validation: (Rule: any) => Rule.length(3).warning(`There should be exactly 3 videos.`),
    },
  ],
}
