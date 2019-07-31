'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getMaxValue = getMaxValue;
exports.createTree = createTree;
exports.getNodeBranchHeight = getNodeBranchHeight;
exports.getTreeNodes = getTreeNodes;
exports.getTreePaths = getTreePaths;

var _orderBy = require('lodash/orderBy');

var _orderBy2 = _interopRequireDefault(_orderBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// It is supposed that root node has id=ROOT_ID and the largest value
function getMaxValue(rootID, nodes) {
  return nodes[rootID].value;
}

function reconcileNodeX(node, chartConfig, level) {
  return _extends({}, node, {
    x: (chartConfig.node.width + chartConfig.link.width) * level
  });
}

function reconcileNodeHeight(node, chartConfig, maxValue) {
  return _extends({}, node, {
    height: Math.max(parseInt(node.value / maxValue * chartConfig.node.maxHeight, 10), chartConfig.node.rectMinHeight)
  });
}

function reconcileNodeChildren(node, chartConfig, rootID, links, nodes, sourceId, level) {
  var children = links.filter(function (link) {
    return link.sourceId == sourceId;
  }).map(function (link) {
    return _extends({}, createTree(chartConfig, rootID, links, nodes, link.targetId, level + 1), { parent: node });
  }); // eslint-disable-line no-use-before-define

  return _extends({}, node, {
    children: chartConfig.keepOrder ? children : (0, _orderBy2.default)(children, ['value'], ['desc'])
  });
}

/**
 * Creates tree structure and prepares some data that will be used to calculate position of each node
 */
function createTree(chartConfig, rootID, links, nodes, sourceId) {
  var level = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  var node = _extends({}, nodes[sourceId], {
    level: level,
    y: 0,
    x: 0,
    height: 0,
    children: [],
    isFirstChild: false,
    isLastChild: false,
    parent: null
  });

  node = reconcileNodeX(node, chartConfig, level);

  node = reconcileNodeHeight(node, chartConfig, getMaxValue(rootID, nodes));

  node = reconcileNodeChildren(node, chartConfig, rootID, links, nodes, sourceId, level);

  return node;
}

function getChildrenHeight(chartConfig, children, initialValue) {
  return children.reduce(function (height, child) {
    return height + getNodeBranchHeight(chartConfig, child) + chartConfig.node.paddingBottom;
  }, initialValue); // eslint-disable-line no-use-before-define
}

// Returns max height of branch for given node (node is assumed as root for this branch)
function branchMaxHeight(chartConfig, node) {
  var childrenHeight = getChildrenHeight(chartConfig, node.children, 0);
  return childrenHeight - chartConfig.node.paddingBottom;
}

// Return height of branch for given node
function getNodeBranchHeight(chartConfig, node) {
  return Math.max(branchMaxHeight(chartConfig, node), node.height, chartConfig.node.minHeight);
}

// find y position of child according to y position of parent and children before this child
function getYChild(chartConfig, parent, currentChildIndex) {
  return getChildrenHeight(chartConfig, parent.children.slice(0, currentChildIndex), parent.y);
}

/**
 * Return tree nodes as flat array and calculate y position of each node.
 */
function getTreeNodes(chartConfig, tree) {
  var result = [tree];

  var getChildren = function getChildren(node) {
    // get children with proper y position
    var children = node.children.map(function (child, i) {
      return _extends({}, child, {
        y: getYChild(chartConfig, node, i),
        isFirstChild: i === 0,
        isLastChild: i === node.children.length - 1
      });
    });

    result = result.concat(children);

    children.forEach(function (child) {
      return getChildren(child);
    });
  };

  getChildren(tree);

  return result;
}

// Returns d attribute to build proper path between nodes
function getTreePaths(chartConfig, links, nodes) {
  return links.map(function (link) {
    var sourceNode = nodes.find(function (node) {
      return node.id == link.sourceId;
    });
    var targetNode = nodes.find(function (node) {
      return node.id == link.targetId;
    });

    if (!sourceNode || !targetNode) {
      throw new Error('should never happen');
    }

    var x1 = sourceNode.x,
        y1 = sourceNode.y;
    var x2 = targetNode.x,
        y2 = targetNode.y;


    var targetsHeight = sourceNode.children.reduce(function (height, child) {
      return height + child.height;
    }, 0);
    var targetIndex = sourceNode.children.findIndex(function (child) {
      return child.id == targetNode.id;
    });
    var curvesStartPositionsPercents = sourceNode.children.map(function (child) {
      return child.height * 100 / targetsHeight;
    });

    // Get y of first point of path
    var cy1 = y1;
    for (var k = 0; k < targetIndex; k += 1) {
      cy1 += curvesStartPositionsPercents[k] * sourceNode.height / 100;
    }

    // Get y of last point of path
    var cy2 = y1;
    for (var _k = 0; _k <= targetIndex; _k += 1) {
      cy2 += curvesStartPositionsPercents[_k] * sourceNode.height / 100;
    }

    var d = '\n      M' + (x1 + chartConfig.node.width) + ' ' + cy1 + '\n      C' + (x2 - chartConfig.link.width / 2) + ' ' + cy1 + ' ' + (x2 - chartConfig.link.width / 2) + ' ' + y2 + ' ' + x2 + ' ' + y2 + ' \n      V' + (y2 + targetNode.height) + '\n      C' + (x2 - chartConfig.link.width / 2) + ' ' + (y2 + targetNode.height) + ' ' + (x2 - chartConfig.link.width / 2) + ' ' + cy2 + ' ' + (x1 + chartConfig.node.width) + ' ' + cy2 + '\n    ';

    return { id: sourceNode.id + '_' + targetNode.id, d: d };
  });
}