// Create an Angular module for this plugin
var module = require('ui/modules').get('relational_filter');
import FilterBarQueryFilterProvider from 'ui/filter_bar/query_filter';

module.controller('relationalFilterController', function($scope, Private) {

    //var filterManager = Private(require('ui/filter_manager'));
    const queryFilter = Private(FilterBarQueryFilterProvider);


  $scope.create_filter = function (tag) {
         console.log("Creating the filter");
         const newFilters = [];
         let filter;
         let alias, field, internal_query;
         alias = $scope.vis.aggs.bySchemaName['filterDisplay'][0]['params']['field']['name'].replace(".keyword","") ;
         field = $scope.vis.aggs.bySchemaName['filterValue'][0]['params']['field']['name'] ;
         console.log(field);
         console.log(tag);
         console.log($scope.vis.params.emptyValue);

         filter = {};
         filter[alias]= tag.label;

         internal_query = { "terms": { } };
         internal_query["terms"][field] = tag.value.split(",") ;

         if ($scope.vis.params.emptyValue){
            console.log("Doing the boolean query");
            internal_query = {"bool":{"should":[internal_query, {"bool":{"must_not":[{"exists":{"field":field}}]}}]}};
         }

         filter["query"]= internal_query;

         newFilters.push(filter);

         return queryFilter.addFilters(newFilters);

  }; 

   $scope.filter_menu = function () {
      console.log("INSIDE THE FILTER_MENU");
      console.log($scope.my_filter);
      $scope.create_filter(JSON.parse($scope.my_filter));
 
   };
   $scope.filter_menu_multiple = function () {
      console.log("INSIDE THE FILTER_MENU MULTIPLE");
      let my_tag;
      let my_object;
      my_tag = {"label":"", "value":""};

      for (var i =0; i< $scope.my_filter.length; i++ ) {
          my_object=JSON.parse($scope.my_filter[i]);
          my_tag['label'] += my_object['label']+",";
          my_tag['value'] += my_object['value']+",";
      }
      // Remove the last ,
      my_tag['label'] = my_tag['label'].slice(0, -1);
      my_tag['value'] = my_tag['value'].slice(0, -1);

      console.log("AND NOW");
      console.log(my_tag);
    
      /*
      $(document).on('keyup', function(event) {
        console.log(event);
        if(event.keyCode== 16 && event.shiftKey) {
            alert('foo');
        }
      });
      
      
      function isKeyPressed(event) {
    if (event.shiftKey) {
        alert("The SHIFT key was pressed!");
    } else {
        alert("The SHIFT key was NOT pressed!");
    }
}
      */
	   
	   
      $scope.create_filter(my_tag);


  }

    $scope.filter = function(tag) {
        console.log("Ready to add a filter");
       console.log(tag);
       $scope.create_filter(tag);
	};


    $scope.$watch('esResponse', function(resp) {
	if (!resp) {
	    $scope.filter_entries = null;
	    return;
	    }

	// Retrieve the id of the configured tags aggregation
        if (! $scope.vis.aggs.bySchemaName['filterDisplay'] || !  $scope.vis.aggs.bySchemaName['filterValue']){
           return;
        }

	var displayId = $scope.vis.aggs.bySchemaName['filterDisplay'][0].id;
        var valuesId = $scope.vis.aggs.bySchemaName['filterValue'][0].id;
        var buckets = resp.aggregations[displayId].buckets;
        $scope.filter_display = $scope.vis.aggs.bySchemaName['filterDisplay'][0]['params']['field']['name'].replace(".keyword","") ;
        $scope.filter_entries = buckets.map( function(bucket) {
           var subbucket = bucket[valuesId].buckets;
           var all_values = subbucket.map (function(subbucket) {
                return subbucket.key;
           });
           return{ label: bucket.key, value: all_values.join()}
        });
        console.log('Filter_entries created');
//        console.log($scope.filter_entries);

	});
        
});
