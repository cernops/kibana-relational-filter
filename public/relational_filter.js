require('plugins/relational_filter/relationalFilterController');

//import { VisController } from './vis_controller';
import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';
import optionsTemplate from 'plugins/relational_filter/filter_options.html';
import visTemplate from 'plugins/relational_filter/relational_filter.html';

// The provider function, which must return our new visualization type
//function RelationalFilterProvider(Private) {
const RelationalFilterProvider = (Private) => {
    const VisFactory = Private(VisFactoryProvider);
    const Schemas = Private(VisSchemasProvider);
    return  VisFactory.createAngularVisualization({
	name: 'trRelationalFilter',
	title: 'Relational Filter',
	icon: 'fa-cloud',
	description: 'Kibana Relational Filter',
	category: CATEGORY.OTHER,
	visConfig: {
	    template: visTemplate,
	    defaults: {
		outputFormat: 'table',
		filterTypes: []
	    }
	},
//	requestHandler: 'none',
	responseHandler: 'none',
	editorConfig: {
	    optionsTemplate: optionsTemplate,
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
		    type: 'string',
		},
	    ]),
	}
    });
}

// Define the aggregation your visualization accepts
VisTypesRegistryProvider.register(RelationalFilterProvider);
