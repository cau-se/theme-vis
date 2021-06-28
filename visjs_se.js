//import graph data sets

import {
	nodesComplete,
	edgesComplete
} from './data.js';

export {
	search
};

var searchNodeId = 0;

//data set of initially visible nodes
var nodes = new vis.DataSet([{
	id: 9,
	label: "root",
	physics: false
}]);

//data set of initially visible edges
var edges = new vis.DataSet([]);

var container = document.getElementById("mynetwork");

var data = {
	nodes: nodes,
	edges: edges,
};

//some layout options
var options = {
	autoResize: true,
	height: '100%',
	width: '100%',
	locale: 'en',
	physics: {
		enabled: true,
		minVelocity: 15.0,

		stabilization: {
			enabled: true,
			iterations: 1000,
			fit: true
		},
		solver: 'forceAtlas2Based',
		/*
		forceAtlas2Based: {
			theta: 0.1,
			gravitationalConstant: -1000,
			centralGravity: 0.01,
			springLength: 50,
			springConstant: 0.1,
			avoidOverlap: 0,
			damping: 1
		},
	
		forceAtlas2Based: {
			theta: 0.1,
			gravitationalConstant: -5000,
			centralGravity: 0.05,
			springLength: 50,
			springConstant: 0.5,
			avoidOverlap: 0,
			damping: 1
		},
		*/

		forceAtlas2Based: {
			theta: 0.1,
			gravitationalConstant: -1500,
			centralGravity: 0.05,
			springLength: 15,
			springConstant: 0.1,
			avoidOverlap: 0.0,
			damping: 1.0
		},

		hierarchicalRepulsion: {
			nodeDistance: 400,
			centralGravity: 0.5,
			avoidOverlap: 0.5
		},
		barnesHut: {
			gravitationalConstant: -10000,
			springConstant: 0.01
		}
	},

	layout: {
		improvedLayout: false,
		hierarchical: {
			enabled: false
		}
	},

	edges: {
		smooth: {
			enabled: false
		},
		arrows: {
			to: {
				enabled: true,
				scaleFactor: 1,
				type: "arrow"
			}
		}
	},

	nodes: {
		shapeProperties: {
			interpolation: false
		},
		color: {
			highlight: {
				border: '#3e7de5',
				background: '#d4e5fd'
			}
		}
	}
};

var network = new vis.Network(container, data, options);

network.on("click", function(properties) {
	var node = properties.nodes[0];
	clickEvent(node);
});


network.on("deselectNode", function(properties) {
	var node = properties.nodes[0];
	deselectNodeEvent(node);
});

/**
 * function for collapse/expand clickEvents on node elements
 * 
 * @param {node} node Node-element that fired the click event
 **/

function clickEvent(node) {
	var connectedEdgesList = edges.get({
		filter: function(item) {
			return (item.from == node);
		}
	});

	if (connectedEdgesList.length > 0) {
		collapse(node);
	} else {
		expand(node);
	}
}

/**
 * function for the delectNode event listener. Makes sure that red painted nodes from a search result go back to normal when another node is being selected.
 *
 *
 * @param {node} node Node-element that fired the click event
 **/

function deselectNodeEvent(node) {
	if (searchNodeId != 0) {
		nodes.update({
			id: searchNodeId,
			color: {
				highlight: {
					// hardcoded colors, ugly!
					border: '#3e7de5',
					background: '#d4e5fd'
				}
			}
		});
		searchNodeId = 0;
	}
}


/** 
 * searches for a specific string in the node labels given by the search text field and highlights all results
 *
 **/

function search() {
	var searchString = document.getElementById("searchString").value;

	var nodeList = nodesComplete.getIds({
		filter: function(item) {
			if (item.label == searchString) {
				recursiveDiscovery(item.id);
				searchNodeId = item.id;
				nodes.update({
					id: item.id,
					color: {
						highlight: "red"
					}
				});
				return true;
			}
		}
	});

	network.selectNodes(nodeList);
	network.once('stabilized', function(params) {
		network.focus(nodeList[0]);
	});

	network.moveTo({
		scale: 0.4
	});

}

/** 
 * backtraces from a specific node to the root element and expands all visited nodes
 *
 * @param {node} node 
 **/

function recursiveDiscovery(node) {
	try {
		nodes.add(nodesComplete.get(node));

		for (const e of edgesComplete.get()) {
			if (e.to == node) {
				recursiveDiscovery(e.from);
			}
		}
	} catch (ex) {
		console.log("Node already exists");
	} finally {
		expand(node);
	}
}

/**
 * "expands" a specific node by determining (edge-)connected nodes and adding the nodes and edges to the visible nodes and edges datasets
 *
 * @param {node} node The node-element to be expanded
 **/

function expand(node) {
	for (const e of edgesComplete.get()) {
		if (e.from == node) {
			try {
				nodes.add(nodesComplete.get(e.to));
			} catch (ex) {
				console.info("Node already exists");
			}

			try {
				edges.add(e);
			} catch (ex) {
				console.info("Edge already exists");
			}
		}
	}
}

/**
 * "collapses" a specific node by determining (edge-)connected nodes and removing the nodes and edges from the visible nodes and edges datasets
 *
 * @param {node} node The node-element to be collapsed
 **/

function collapse(node) {
	var outgoingEdgesList = edges.get({
		filter: function(item) {
			return (item.from == node);
		}
	});

	for (const e of outgoingEdgesList) {
		var incomingEdgesList = edges.get({
			filter: function(item) {
				return (item.to == e.to);
			}
		});

		if (e.from != e.to && incomingEdgesList.length < 2) {
			collapse(e.to);
			nodes.remove(e.to);
		}

		edges.remove(e);
	}
}