// Create an Angular module for this plugin
import { uiModules } from 'ui/modules';
var module = require('ui/modules').get('relational_filter');
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';

module.controller('relationalFilterController', function($scope, Private) {

    //var filterManager = Private(require('ui/filter_manager'));
    const queryFilter = Private(FilterBarQueryFilterProvider);
    var haltKeyPressed = 0;

    $(document).on("keydown focus load", function(e) {
        if (e.keyCode == 16 || e.keyCode == 17) {
            haltKeyPressed = 1;
            console.log('Document ' + e.keyCode + ' haltKeyPressed: ' + haltKeyPressed);
        } else {
            haltKeyPressed = 0;
        };
    });
    $(document).on("keyup", function(e) {

        haltKeyPressed = 0;
        console.log('Document ' + e.keyCode + ' haltKeyNotPressed: ' + haltKeyPressed);

    });

    $scope.onKeyUp = function(keyEvent) {
        console.log('onKeyUp');
        if (keyEvent.which === 16 || keyEvent.which === 17) {
            haltKeyPressed = 0;
            console.log('Up haltKeyPressed: ' + haltKeyPressed);
            keyEvent.stopPropagation();
            $scope.filter_menu_multiple();
        }
    }

    $scope.onLostFocus = function(keyEvent) {
        console.log('onLostFocus');
        haltKeyPressed = 0;
        keyEvent.stopPropagation();
        $scope.filter_menu_multiple();
    }

    $scope.create_filter = function(tag) {
        console.log("Creating the filter");
        const newFilters = [];
        let filter;
        let alias, field, internal_query;
        alias = $scope.vis.aggs.bySchemaName['filterDisplay'][0]['params']['field']['name'].replace(".keyword", "");
        field = $scope.vis.aggs.bySchemaName['filterValue'][0]['params']['field']['name'];
        console.log(field);
        console.log(tag);
        console.log($scope.vis.params.emptyValue);

        filter = {'meta':{'type':'query'}};
        filter[alias] = tag.label;

        internal_query = {
            "terms": {}
        };
        internal_query["terms"][field] = tag.value.split(",");

        if ($scope.vis.params.emptyValue) {
            console.log("Doing the boolean query");
            internal_query = {
                "bool": {
                    "should": [internal_query, {
                        "bool": {
                            "must_not": [{
                                "exists": {
                                    "field": field
                                }
                            }]
                        }
                    }]
                }
            };
        }

        filter["query"] = internal_query;

        newFilters.push(filter);

        return queryFilter.addFilters(newFilters);

    };

    $scope.filter_menu = function() {
        console.log("INSIDE THE FILTER_MENU");
        console.log($scope.my_filter);
        $scope.create_filter(JSON.parse($scope.my_filter));

    };

    $scope.filter_menu_multiple = function() {
        console.log("INSIDE THE FILTER_MENU MULTIPLE");
        let my_tag;
        let my_object;
        my_tag = {
            "label": "",
            "value": ""
        };

        if (typeof $scope.my_filter === 'undefined' || !$scope.my_filter) {
            console.log('$scope.my_filter undefined');
            return;
        }

        for (var i = 0; i < $scope.my_filter.length; i++) {
            my_object = JSON.parse($scope.my_filter[i]);
            my_tag['label'] += my_object['label'] + ",";
            my_tag['value'] += my_object['value'] + ",";
        }

        // Remove the last ,
        my_tag['label'] = my_tag['label'].slice(0, -1);
        my_tag['value'] = my_tag['value'].slice(0, -1);

        console.log("AND NOW");
        console.log("my tag: " + my_tag);

        if (haltKeyPressed != 1 && my_tag['label'].length != 0) {
            console.log('haltKeyPressed: ' + haltKeyPressed);
            $scope.create_filter(my_tag);
            $scope.my_filter = '';
        }
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
        if (!$scope.vis.aggs.bySchemaName['filterDisplay'] || !$scope.vis.aggs.bySchemaName['filterValue']) {
            return;
        }

        var displayId = $scope.vis.aggs.bySchemaName['filterDisplay'][0].id;
        var valuesId = $scope.vis.aggs.bySchemaName['filterValue'][0].id;
        var buckets = resp.aggregations[displayId].buckets;
        $scope.filter_display = $scope.vis.aggs.bySchemaName['filterDisplay'][0]['params']['field']['name'].replace(".keyword", "");
        $scope.filter_entries = buckets.map(function(bucket) {
            var subbucket = bucket[valuesId].buckets;
            var all_values = subbucket.map(function(subbucket) {
                return subbucket.key;
            });
            return {
                label: bucket.key,
                value: all_values.join()
            }
        });
        console.log('Filter_entries created');
        //        console.log($scope.filter_entries);

    });

});
