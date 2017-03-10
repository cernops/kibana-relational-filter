# kibana-relational-filter

This is a kibana plugin to create filters based on different indices. It creates a new visualization, the relational-filter, which can be included in dashboards. The visualization comes with three display options: a standard table, a drop-down menu or a multiple select. 

Imagine any of the following scenarios: 
 * There are computer jobs that can be executed on different computer centers. Each computer center can be on a different country. You want to get all the jobs running on a particular country.
 * Your company has a list of all the sales and another list with all the customers. You want to get a list of all the sales to customers that speak a particular language.
 * You have list of movies and actors, and you want to get all the movies with an actor that has won an Oscar
 * 

All these scenarios are quite easy to solve with relational databases. The current approach to solve them with elasticsearch and kibana is to denormalize the data: create a single document type with the replication of all the information that might be needed. Elasticsearch does offer parent-child relation (see https://www.elastic.co/guide/en/elasticsearch/reference/5.2/mapping-parent-field.html), with the restrictions that both document types have to be on the same index. At the time of writting this plugin, Kibana does not support it. 

This plugin offers a different alternative to do all these relational queries. The approach is to keep the two types of documents separate, even on different indices,  and then create a visualization that will do the select on the first type of document, and apply the filter to the second. 

Coming back to the examples, this would be the approach:a

* Create a document type with the jobs, which include the name of the computer center. Create a different document type with the data centers, which includes, at least, the name of the computer center and the country. Create a relational-filter visualization on the data centers, displayin country and applying the restriction on the name of the computer center
* Create a document type with sales, which include an attribute like 'user'.  Create a different document type with users, which includes, at least, 'user' and 'country'. Create a relational-filter visualization on the users, displaying the field 'country', and applying the restriction on the 'user'.
* Create a document type with the movies, which include a list user 'actor'. Create a different document type with actors, with at least a field call 'actor' and another with 'awarded_oscar'. Create a relational-filter on the actors, displaying the field 'awarded_oscar', and applying the restricion on 'user'.


And here you have a couple of screen shots of the first use cases:
* ![screenshot] (https://github.com/psaiz/kibana-relational-filter/blob/master/images/before.png "Before applying the filter. Note the two relational visualizations on the left")
* ![screenshot] (https://github.com/psaiz/kibana-relational-filter/blob/master/images/after.png "After selecting one country")






# TODO

This is the very first draft of the plugin. There are quite a lot of possible improvements, like:

 * Add option to include the document type of the filter in the query
 * Offer multiple filters on different documents
