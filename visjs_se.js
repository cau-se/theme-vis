//import graph data sets
import {
	nodesComplete,
	edgesComplete
} from './data.js';

//data set of initially visible nodes
var nodes = new vis.DataSet([
	{id: 9, label: "root"}
]);

//data set of initially visible edges
var edges = new vis.DataSet([]);

var container = document.getElementById("mynetwork");

var data = {
	nodes: nodes,
	edges: edges,
};

//some layout options
var options = {
	physics: {
		enabled: true,
		stabilization: {
			enabled: true,
			iterations: 1000,
			fit: true
		},
		solver: 'forceAtlas2Based',
		forceAtlas2Based: {
			theta: 0.1,
			gravitationalConstant: -1000,
			centralGravity: 0.01,
			springLength: 50,
			springConstant: 0.1,
			avoidOverlap: 0,
			damping: 1
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
		}
	}
};

var network = new vis.Network(container, data, options);

network.on("click", function(properties) {
	var node = properties.nodes[0];
	clickEvent(node, false);
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
		console.log("collapse");
		collapse(node, false);
	} else {
		console.log("expand");
		expand(node);
	}
}

function search() {
	var searchString = document.getElementById("searchString").value;

	var nodeList = nodes.get({
		filter: function(item) {
			return (item.label == searchString);
		}
	});

	for (const node of nodeList) {
		console.log(node);
		network.selectNodes([node.id]);
		network.focus(node.id);
		network.moveTo({
			scale: 0.5
		});
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

			edges.add(e);
		}
	}
}

/**
* "collapses" a specific node by determining (edge-)connected nodes and removing the nodes and edges from the visible nodes and edges datasets
*
* @param {node} node The node-element to be collapsed
**/

function collapse(node, hideNode) {
	var connectedEdgesList = edges.get({
		filter: function(item) {
			return (item.from == node);
		}
	});

	if (hideNode) {
		var currentNode = nodes.get(node);
		nodes.remove(node);
	}

	for (const e of connectedEdgesList) {
		if (e.from != e.to) {
			collapse(e.to, true);
			nodes.remove(e.to);
			edges.remove(e);
		}
	}
}
