import { uiModules } from 'ui/modules';

// Create an Angular module for this plugin
var module = require('ui/modules').get('relational_filter');
import { FilterBarQueryFilterProvider }  from 'ui/filter_bar/query_filter';

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
        let alias, field, internal_query, a, b;
        alias = $scope.vis.aggs.bySchemaName['filterDisplay'][0]['params']['field']['name'].replace(".keyword", "");
        field = $scope.vis.aggs.bySchemaName['filterValue'][0]['params']['field']['name'];

        filter = {'meta':{'type':'query'}};
        filter[alias] = tag.label;

        internal_query = {
            "terms": {}
        };
        internal_query["terms"][field] = tag['values'];

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

        a = queryFilter.addFilters(newFilters);
        console.log("ADDED THE FILTER");
        return a;

    };

    $scope.filter_menu = function() {
        console.log("INSIDE THE FILTER_MENU");
        $scope.create_filter(JSON.parse($scope.my_filter));

    };

    $scope.filter_menu_multiple = function() {
        console.log("INSIDE THE FILTER_MENU MULTIPLE");
        let my_tag;
        let my_object;
        my_tag = {
            "label": "",
            "values": [],
        };

        if (typeof $scope.my_filter === 'undefined' || !$scope.my_filter) {
            console.log('$scope.my_filter undefined');
            return;
        }

        for (var i = 0; i < $scope.my_filter.length; i++) {
            my_object = JSON.parse($scope.my_filter[i]);
            my_tag['label'] += my_object['label'] + ",";
            my_tag['values'] = my_tag['values'].concat(my_object['values']);
        }

        // Remove the last ,
        my_tag['label'] = my_tag['label'].slice(0, -1);

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
        console.log("FILTER ADDED!!!");
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
        console.log('Creating the filter');
        var displayId = $scope.vis.aggs.bySchemaName['filterDisplay'][0].id;
        var valuesId = $scope.vis.aggs.bySchemaName['filterValue'][0].id;
        var buckets = resp.rows;
        $scope.filter_display = $scope.vis.aggs.bySchemaName['filterDisplay'][0]['params']['field']['name'].replace(".keyword", "");
        var current_display = '';
        $scope.filter_entries = [];
        var current_values = [];
        buckets.forEach(function (item, index) {
                            var display= item['col-0-1'];
                            var value = item['col-1-2'];
                            if (current_display == display) {
                               current_values.push(value);
                            } else {
                               if (current_display!= '') {
                                  $scope.filter_entries.push({'label': current_display, 'values':current_values});
                               }
                               current_values = [value];
                               current_display = display;
                            }
                       });
        if (current_display!= '') {
           $scope.filter_entries.push({'label': current_display, 'values':current_values});
        }

        console.log('Filter_entries created');
        //        console.log($scope.filter_entries);

    });
    $scope.renderComplete();
});
