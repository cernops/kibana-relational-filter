require('plugins/relational_filter/relationalFilterController');

import { Status } from 'ui/vis/update_status';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { Schemas } from 'ui/vis/editors/default/schemas';
import optionsTemplate from 'plugins/relational_filter/filter_options.html';
import visTemplate from 'plugins/relational_filter/relational_filter.html';

// The provider function, which must return our new visualization type
VisTypesRegistryProvider.register( function (Private)  {
    const VisFactory = Private(VisFactoryProvider);
    return  VisFactory.createAngularVisualization({
        type: 'relationalFilter',
	name: 'trRelationalFilter',
	title: 'Relational Filter',
	icon: 'gear',
	description: 'Kibana Relational Filter',
	visConfig: {
	    template: visTemplate,
	    defaults: {
		outputFormat: 'table',
		filterTypes: [],
                totalFunc: 'sum'

	    }
	},

	editorConfig: {
	    optionsTemplate: optionsTemplate,
	    schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'My metric',
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          min: 1,
          max: 1,
          defaults: [
            { type: 'count', schema: 'metric' }
          ]
        },

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
		    type: 'string',
		},
	    ]),   
	} 
    });
});
