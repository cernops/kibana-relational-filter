module.exports = function(kibana) {
	return new kibana.Plugin({
		uiExports: {
			visTypes: ['plugins/relational_filter/relational_filter']
		}
	});

}

