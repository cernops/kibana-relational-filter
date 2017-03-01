require('plugins/relational_filter/relationalFilterController');

import optionsTemplate from 'plugins/relational_filter/filter_options.html';



// The provider function, which must return our new visualization type
function RelationalFilterProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/template_vis_type'));
    // Include the Schemas class, which will be used to define schemas
    var Schemas = Private(require('ui/vis/schemas'));

    // Describe our visualization
    return new TemplateVisType({
	name: 'trRelationalFilter', // The internal id of the visualization (must be unique)
	title: 'Relational Filter', // The title of the visualization, shown to the user
	description: 'Visualization for filtering based on different document types ', // The description of this vis
	icon: 'fa-cloud', // The font awesome icon of this visualization
	template: require('plugins/relational_filter/relational_filter.html'), // The template, that will be rendered for this visualization
        params: {
           editor: optionsTemplate,
           defaults: {
             outputFormat: 'table',
             filterTypes: []
           }
       },

	// Define the aggregation your visualization accepts

	schemas: new Schemas([
	    {
		group: 'buckets',
		name: 'filterDisplay',
		title: 'Filter Display',
		min: 1,
		max: 1,
		aggFilter: ['terms'],
                type: 'string',
		},

            {
                group: 'buckets',
                name: 'filterValue',
                title: 'Filter Value',
                min: 1,
                max: 1,
                aggFilter: [ 'terms'],
                type: 'string'
                },

	    ])
	});
}

require('ui/registry/vis_types').register(RelationalFilterProvider);
