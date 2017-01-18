'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _reactLeaflet = require('react-leaflet');

var _simpleheat = require('simpleheat');

var _simpleheat2 = _interopRequireDefault(_simpleheat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isValidLatLngArray(arr) {
  return (0, _lodash.filter)(arr, isValid).length === arr.length;
}

function isInvalidLatLngArray(arr) {
  return !isValidLatLngArray(arr);
}

function isInvalid(num) {
  return !(0, _lodash.isNumber)(num) && !num;
}

function isValid(num) {
  return !isInvalid(num);
}

function shouldIgnoreLocation(loc) {
  return isInvalid(loc.lng) || isInvalid(loc.lat);
}

var HeatmapLayer = function (_MapLayer) {
  _inherits(HeatmapLayer, _MapLayer);

  function HeatmapLayer() {
    _classCallCheck(this, HeatmapLayer);

    return _possibleConstructorReturn(this, _MapLayer.apply(this, arguments));
  }

  HeatmapLayer.prototype.componentDidMount = function componentDidMount() {
    this.leafletElement = this.container;
    this.props.map.getPanes().overlayPane.appendChild(this.leafletElement);
    this._heatmap = (0, _simpleheat2.default)(this.leafletElement);

    if (this.props.fitBoundsOnLoad) {
      this.fitBounds();
    }

    this.attachEvents();
    this.updateHeatmapProps(this.getHeatmapProps(this.props));
    this.reset();
  };

  HeatmapLayer.prototype.getMax = function getMax(props) {
    // eslint-disable-line
    return props.max || 3.0;
  };

  HeatmapLayer.prototype.getRadius = function getRadius(props) {
    // eslint-disable-line
    return props.radius || 30;
  };

  HeatmapLayer.prototype.getMaxZoom = function getMaxZoom(props) {
    // eslint-disable-line
    return props.maxZoom || 18;
  };

  HeatmapLayer.prototype.getMinOpacity = function getMinOpacity(props) {
    // eslint-disable-line
    return props.minOpacity || 0.01;
  };

  HeatmapLayer.prototype.getBlur = function getBlur(props) {
    // eslint-disable-line
    return props.blur || 15;
  };

  HeatmapLayer.prototype.getHeatmapProps = function getHeatmapProps(props) {
    return {
      minOpacity: this.getMinOpacity(props),
      maxZoom: this.getMaxZoom(props),
      radius: this.getRadius(props),
      blur: this.getBlur(props),
      max: this.getMax(props),
      gradient: props.gradient
    };
  };

  HeatmapLayer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.updateHeatmapProps(this.getHeatmapProps(nextProps));
  };

  HeatmapLayer.prototype.updateHeatmapProps = function updateHeatmapProps(nextProps) {
    if (nextProps.radius && (!this.props || nextProps.radius !== this.props.radius)) {
      this._heatmap.radius(nextProps.radius);
    }

    if (nextProps.gradient) {
      this._heatmap.gradient(nextProps.gradient);
    }

    if (nextProps.max && (!this.props || nextProps.max !== this.props.max)) {
      this._heatmap.max(nextProps.max);
    }
  };

  HeatmapLayer.prototype.createLeafletElement = function createLeafletElement() {
    // eslint-disable-line
    return null;
  };

  HeatmapLayer.prototype.componentWillUnmount = function componentWillUnmount() {
    this.props.map.getPanes().overlayPane.removeChild(this.leafletElement);
  };

  HeatmapLayer.prototype.fitBounds = function fitBounds() {
    var points = this.props.points;
    var lngs = (0, _lodash.map)(points, this.props.longitudeExtractor);
    var lats = (0, _lodash.map)(points, this.props.latitudeExtractor);
    var ne = { lng: (0, _lodash.max)(lngs), lat: (0, _lodash.max)(lats) };
    var sw = { lng: (0, _lodash.min)(lngs), lat: (0, _lodash.min)(lats) };

    if (shouldIgnoreLocation(ne) || shouldIgnoreLocation(sw)) {
      return;
    }

    this.props.map.fitBounds(_leaflet2.default.latLngBounds(_leaflet2.default.latLng(sw), _leaflet2.default.latLng(ne)));
  };

  HeatmapLayer.prototype.componentDidUpdate = function componentDidUpdate() {
    this.props.map.invalidateSize();
    if (this.props.fitBoundsOnUpdate) {
      this.fitBounds();
    }
    this.reset();
  };

  HeatmapLayer.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    return true;
  };

  HeatmapLayer.prototype.attachEvents = function attachEvents() {
    var _this2 = this;

    var maps = Map = this.props.map;
    maps.on('viewreset', function () {
      return _this2.reset();
    });
    maps.on('moveend', function () {
      return _this2.reset();
    });
    if (maps.options.zoomAnimation && _leaflet2.default.Browser.any3d) {
      maps.on('zoomanim', this._animateZoom, this);
    }
  };

  HeatmapLayer.prototype._animateZoom = function _animateZoom(e) {
    var scale = this.props.map.getZoomScale(e.zoom);
    var offset = this.props.map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this.props.map._getMapPanePos());

    if (_leaflet2.default.DomUtil.setTransform) {
      _leaflet2.default.DomUtil.setTransform(this.container, offset, scale);
    } else {
      this.container.style[_leaflet2.default.DomUtil.TRANSFORM] = _leaflet2.default.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
  };

  HeatmapLayer.prototype.reset = function reset() {
    var topLeft = this.props.map.containerPointToLayerPoint([0, 0]);
    _leaflet2.default.DomUtil.setPosition(this.container, topLeft);

    var size = this.props.map.getSize();

    if (this._heatmap._width !== size.x) {
      this.container.width = this._heatmap._width = size.x;
    }
    if (this._heatmap._height !== size.y) {
      this.container.height = this._heatmap._height = size.y;
    }

    if (this._heatmap && !this._frame && !this.props.map._animating) {
      this._frame = _leaflet2.default.Util.requestAnimFrame(this.redraw, this);
    }

    this.redraw();
  };

  HeatmapLayer.prototype.redraw = function redraw() {
    var r = this._heatmap._r;
    var size = this.props.map.getSize();

    var maxIntensity = this.props.max === undefined ? 1 : this.getMax(this.props);

    var maxZoom = this.props.maxZoom === undefined ? this.props.map.getMaxZoom() : this.getMaxZoom(this.props);

    var v = 1 / Math.pow(Math.max(0, Math.min(maxZoom - this.props.map.getZoom(), 12)), 2);

    var cellSize = r / 2;
    var panePos = this.props.map._getMapPanePos();
    var offsetX = panePos.x % cellSize;
    var offsetY = panePos.y % cellSize;
    var getLat = this.props.latitudeExtractor;
    var getLng = this.props.longitudeExtractor;
    var getIntensity = this.props.intensityExtractor;

    var inBounds = function inBounds(p, bounds) {
      return bounds.contains(p);
    };

    var filterUndefined = function filterUndefined(rUndefined) {
      return (0, _lodash.filter)(rUndefined, function (c) {
        return c !== undefined;
      });
    };

    var roundResults = function roundResults(results) {
      return (0, _lodash.reduce)(results, function (result, row) {
        return (0, _lodash.map)(filterUndefined(row), function (cell) {
          return [Math.round(cell[0]), Math.round(cell[1]), Math.min(cell[2], maxIntensity), cell[3]];
        }).concat(result);
      }, []);
    };

    var accumulateInGrid = function accumulateInGrid(points, leafletMap, bounds) {
      return (0, _lodash.reduce)(points, function (grid, point) {
        var latLng = [getLat(point), getLng(point)];
        if (isInvalidLatLngArray(latLng)) {
          // skip invalid points
          return grid;
        }

        var p = leafletMap.latLngToContainerPoint(latLng);

        if (!inBounds(p, bounds)) {
          return grid;
        }

        var x = Math.floor((p.x - offsetX) / cellSize) + 2;
        var y = Math.floor((p.y - offsetY) / cellSize) + 2;

        grid[y] = grid[y] || [];
        var cell = grid[y][x];

        var alt = getIntensity(point);
        var k = alt * v;

        if (!cell) {
          grid[y][x] = [p.x, p.y, k, 1];
        } else {
          cell[0] = (cell[0] * cell[2] + p.x * k) / (cell[2] + k); // x
          cell[1] = (cell[1] * cell[2] + p.y * k) / (cell[2] + k); // y
          cell[2] += k; // accumulated intensity value
          cell[3] += 1;
        }

        return grid;
      }, []);
    };

    var getBounds = function getBounds() {
      return new _leaflet2.default.Bounds(_leaflet2.default.point([-r, -r]), size.add([r, r]));
    };

    var getDataForHeatmap = function getDataForHeatmap(points, leafletMap) {
      return roundResults(accumulateInGrid(points, leafletMap, getBounds(leafletMap)));
    };
    var data = getDataForHeatmap(this.props.points, this.props.map);

    this._heatmap.clear();
    this._heatmap.data(data).draw(this.getMinOpacity(this.props));

    this._frame = null;
  };

  HeatmapLayer.prototype.render = function render() {
    var _style,
        _this3 = this;

    var mapSize = this.props.map.getSize();
    var transformProp = _leaflet2.default.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
    var canAnimate = this.props.map.options.zoomAnimation && _leaflet2.default.Browser.any3d;
    var zoomClass = 'leaflet-zoom-' + (canAnimate ? 'animated' : 'hide');

    var canvasProps = {
      className: 'leaflet-heatmap-layer leaflet-layer ' + zoomClass,
      style: (_style = {}, _style[transformProp] = '50% 50%', _style),
      width: mapSize.x,
      height: mapSize.y
    };

    return _react2.default.createElement('canvas', _extends({ ref: function ref(_ref) {
        return _this3.container = _ref;
      } }, canvasProps));
  };

  return HeatmapLayer;
}(_reactLeaflet.MapLayer);

HeatmapLayer.propTypes = {
  points: _react2.default.PropTypes.array.isRequired,
  longitudeExtractor: _react2.default.PropTypes.func.isRequired,
  latitudeExtractor: _react2.default.PropTypes.func.isRequired,
  intensityExtractor: _react2.default.PropTypes.func.isRequired,
  fitBoundsOnLoad: _react2.default.PropTypes.bool,
  fitBoundsOnUpdate: _react2.default.PropTypes.bool,
  onStatsUpdate: _react2.default.PropTypes.func,
  /* props controlling heatmap generation */
  max: _react2.default.PropTypes.number,
  radius: _react2.default.PropTypes.number,
  maxZoom: _react2.default.PropTypes.number,
  minOpacity: _react2.default.PropTypes.number,
  blur: _react2.default.PropTypes.number,
  gradient: _react2.default.PropTypes.object
};
exports.default = HeatmapLayer;
