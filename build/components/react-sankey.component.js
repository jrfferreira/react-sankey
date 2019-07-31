'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.formatNumber = formatNumber;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactSankey = require('../helpers/react-sankey');

require('./react-sankey.component.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultChartConfig = {
  padding: { top: 10, right: 0, bottom: 10, left: 0 },
  node: {
    width: 150,
    maxHeight: 150,
    minHeight: 55,
    rectMinHeight: 5,
    paddingBottom: 40
  },
  link: {
    width: 100
  }
};

// Example 3985763 -> 3,985,763
function formatNumber(value) {
  return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

var ReactSankey = function (_React$Component) {
  _inherits(ReactSankey, _React$Component);

  function ReactSankey() {
    _classCallCheck(this, ReactSankey);

    return _possibleConstructorReturn(this, (ReactSankey.__proto__ || Object.getPrototypeOf(ReactSankey)).apply(this, arguments));
  }

  _createClass(ReactSankey, [{
    key: 'renderNodeArrows',
    value: function renderNodeArrows(node) {
      var chartConfig = this.getConfig();
      var className = this.props.arrowClass ? this.props.arrowClass : 'qb-node-arrow';

      if (node.isFirstChild && node.isLastChild) {
        return _react2.default.createElement('path', {
          className: className,
          d: '\n            M' + -10 + ' ' + 20.5 + ' h-' + chartConfig.link.width + '\n            M' + -10 + ' ' + 20.5 + ' l' + -4 + ' ' + -4 + '\n            M' + -10 + ' ' + 20.5 + ' l' + -4 + ' ' + 4 + '\n          '
        });
      }

      if (node.isFirstChild) {
        return _react2.default.createElement('path', {
          className: className,
          d: '\n            M' + -10 + ' ' + 20.5 + ' h-' + chartConfig.link.width + '\n            M' + -10 + ' ' + 20.5 + ' l' + -4 + ' ' + -4 + '\n            M' + -10 + ' ' + 20.5 + ' l' + -4 + ' ' + 4 + '\n            M-' + (parseInt(chartConfig.link.width / 3, 10) - 0.5) + ' ' + 20.5 + ' v' + ((0, _reactSankey.getNodeBranchHeight)(chartConfig, node) + chartConfig.node.paddingBottom) + '\n          '
        });
      }

      if (node.isLastChild) {
        return _react2.default.createElement('path', {
          className: className,
          d: '\n            M' + -10 + ' ' + 20.5 + ' h-' + (parseInt(chartConfig.link.width / 3, 10) - 10) + '\n            M' + -10 + ' ' + 20.5 + ' l' + -4 + ' ' + -4 + '\n            M' + -10 + ' ' + 20.5 + ' l' + -4 + ' ' + 4 + '\n          '
        });
      }

      return _react2.default.createElement('path', {
        className: className,
        d: '\n          M' + -10 + ' ' + 20.5 + ' h-' + (parseInt(chartConfig.link.width / 3, 10) - 10) + '\n          M' + -10 + ' ' + 20.5 + ' l' + -4 + ' ' + -4 + '\n          M' + -10 + ' ' + 20.5 + ' l' + -4 + ' ' + 4 + '\n          M-' + (parseInt(chartConfig.link.width / 3, 10) - 0.5) + ' ' + 20.5 + ' v' + ((0, _reactSankey.getNodeBranchHeight)(chartConfig, node) + chartConfig.node.paddingBottom) + '\n        '
      });
    }
  }, {
    key: 'renderPath',
    value: function renderPath(path) {
      var className = this.props.linkClass ? this.props.linkClass : 'qb-link';
      return _react2.default.createElement('path', { key: path.id, className: className, d: path.d });
    }
  }, {
    key: 'renderNode',
    value: function renderNode(chartConfig, node) {

      if (this.props.customNode) {
        return this.props.customNode(chartConfig, node);
      }

      return _react2.default.createElement(
        'g',
        { key: node.id, className: 'qb-node', transform: 'translate(' + node.x + ',' + node.y + ')' },
        _react2.default.createElement('rect', { height: node.height, width: chartConfig.node.width }),
        _react2.default.createElement(
          'text',
          { x: 30, y: 24 },
          '' + node.title
        ),
        _react2.default.createElement(
          'text',
          { className: 'qb-value', x: 30, y: 50 },
          '' + formatNumber(node.value)
        )
      );
    }
  }, {
    key: 'renderArrow',
    value: function renderArrow(node) {
      if (node.id == this.props.rootID) {
        return null;
      }

      return _react2.default.createElement(
        'g',
        { key: node.id, className: 'qb-arrow', transform: 'translate(' + node.x + ',' + node.y + ')' },
        this.renderNodeArrows(node)
      );
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      return this.props.chartConfig ? this.props.chartConfig : defaultChartConfig;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var chartConfig = this.getConfig();
      var tree = (0, _reactSankey.createTree)(chartConfig, this.props.rootID, this.props.links, this.props.nodes, this.props.rootID);
      var nodes = (0, _reactSankey.getTreeNodes)(chartConfig, tree);
      var pathes = (0, _reactSankey.getTreePaths)(chartConfig, this.props.links, nodes);

      var maxTreeLevel = nodes.reduce(function (level, node) {
        return Math.max(level, node.level);
      }, 0);
      var chartWidth = (maxTreeLevel + 1) * chartConfig.node.width + maxTreeLevel * chartConfig.link.width;

      var chartHeight = nodes.reduce(function (height, node) {
        // find total height of node children
        var currentChildrenHeight = node.children.reduce(function (childrenHeight, child) {
          return childrenHeight + (0, _reactSankey.getNodeBranchHeight)(chartConfig, child) + chartConfig.node.paddingBottom;
        }, 0);

        // exclude bottom padding of last child and add parent y position
        currentChildrenHeight = currentChildrenHeight - chartConfig.node.paddingBottom + node.y;
        return Math.max(currentChildrenHeight, height);
      }, 0);

      var _chartConfig$padding = chartConfig.padding,
          left = _chartConfig$padding.left,
          right = _chartConfig$padding.right,
          top = _chartConfig$padding.top,
          bottom = _chartConfig$padding.bottom;


      return _react2.default.createElement(
        'svg',
        { width: chartWidth + left + right, height: chartHeight + top + bottom },
        _react2.default.createElement(
          'g',
          { transform: 'translate(' + left + ',' + top + ')' },
          pathes.map(function (path) {
            return _this2.renderPath(path);
          }),
          nodes.map(function (node) {
            return _this2.renderNode(chartConfig, node);
          }),
          chartConfig.link.width >= 60 && this.props.hasArrows && nodes.map(function (node) {
            return _this2.renderArrow(node);
          }),
          _react2.default.createElement(
            'linearGradient',
            { id: 'linear-gradient' },
            _react2.default.createElement('stop', { offset: '0%', stopColor: '#D1DFE0' }),
            _react2.default.createElement('stop', { offset: '100%', stopColor: '#D5EDEF' })
          )
        )
      );
    }
  }]);

  return ReactSankey;
}(_react2.default.Component);

ReactSankey.propTypes = {};

exports.default = ReactSankey;