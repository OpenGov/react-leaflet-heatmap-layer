'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.map');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.reduce');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.filter');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.min');

var _lodash8 = _interopRequireDefault(_lodash7);

var _lodash9 = require('lodash.max');

var _lodash10 = _interopRequireDefault(_lodash9);

var _lodash11 = require('lodash.isnumber');

var _lodash12 = _interopRequireDefault(_lodash11);

var _leaflet = require('leaflet');

var _leaflet2 = _interopRequireDefault(_leaflet);

var _reactLeaflet = require('react-leaflet');

var _simpleheat = require('simpleheat');

var _simpleheat2 = _interopRequireDefault(_simpleheat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isTrue(cond) {
  if (cond) return true;
  return false;
}

function isInvalid(num) {
  return !(0, _lodash12.default)(num) && !num;
}

function isValid(num) {
  return !isInvalid(num);
}

function isValidLatLngArray(arr) {
  return (0, _lodash6.default)(arr, isValid).length === arr.length;
}

function isInvalidLatLngArray(arr) {
  return !isValidLatLngArray(arr);
}

function safeRemoveLayer(leafletMap, el) {
  var _leafletMap$getPanes = leafletMap.getPanes(),
      overlayPane = _leafletMap$getPanes.overlayPane;

  if (overlayPane.contains(el)) {
    overlayPane.removeChild(el);
  }
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

  HeatmapLayer.prototype.createLeafletElement = function createLeafletElement() {
    return null;
  };

  HeatmapLayer.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var canAnimate = this.context.map.options.zoomAnimation && _leaflet2.default.Browser.any3d;
    var zoomClass = 'leaflet-zoom-' + (canAnimate ? 'animated' : 'hide');
    var mapSize = this.context.map.getSize();
    var transformProp = _leaflet2.default.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);

    this._el = _leaflet2.default.DomUtil.create('canvas', zoomClass);
    this._el.style[transformProp] = '50% 50%';
    this._el.width = mapSize.x;
    this._el.height = mapSize.y;

    var el = this._el;

    var Heatmap = _leaflet2.default.Layer.extend({
      onAdd: function onAdd(leafletMap) {
        return leafletMap.getPanes().overlayPane.appendChild(el);
      },
      addTo: function addTo(leafletMap) {
        leafletMap.addLayer(_this2);
        return _this2;
      },
      onRemove: function onRemove(leafletMap) {
        return safeRemoveLayer(leafletMap, el);
      }
    });

    this.leafletElement = new Heatmap();
    _MapLayer.prototype.componentDidMount.call(this);
    this._heatmap = (0, _simpleheat2.default)(this._el);
    this.reset();

    if (this.props.fitBoundsOnLoad) {
      this.fitBounds();
    }

    this.attachEvents();
    this.updateHeatmapProps(this.getHeatmapProps(this.props), true);
  };

  HeatmapLayer.prototype.getMax = function getMax(props) {
    return props.max || 3.0;
  };

  HeatmapLayer.prototype.getRadius = function getRadius(props) {
    return props.radius || 30;
  };

  HeatmapLayer.prototype.getMaxZoom = function getMaxZoom(props) {
    return props.maxZoom || 18;
  };

  HeatmapLayer.prototype.getMinOpacity = function getMinOpacity(props) {
    return props.minOpacity || 0.01;
  };

  HeatmapLayer.prototype.getBlur = function getBlur(props) {
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
    this.updateHeatmapProps(this.getHeatmapProps(nextProps), false);
  };

  HeatmapLayer.prototype.updateHeatmapProps = function updateHeatmapProps(nextProps, firstUpdate) {
    if ([[nextProps.radius, [firstUpdate, nextProps.radius !== this.props.radius].some(isTrue)].every(isTrue), [nextProps.blur, [firstUpdate, nextProps.blur !== this.props.blur].some(isTrue)].every(isTrue)].some(isTrue)) {
      this._heatmap.radius(nextProps.radius, nextProps.blur);
    }

    if (nextProps.gradient) {
      this._heatmap.gradient(nextProps.gradient);
    }

    if (nextProps.max && (firstUpdate || nextProps.max !== this.props.max)) {
      this._heatmap.max(nextProps.max);
    }
  };

  HeatmapLayer.prototype.componentWillUnmount = function componentWillUnmount() {
    safeRemoveLayer(this.context.map, this._el);
  };

  HeatmapLayer.prototype.fitBounds = function fitBounds() {
    var points = this.props.points;
    var lngs = (0, _lodash2.default)(points, this.props.longitudeExtractor);
    var lats = (0, _lodash2.default)(points, this.props.latitudeExtractor);
    var ne = { lng: (0, _lodash10.default)(lngs), lat: (0, _lodash10.default)(lats) };
    var sw = { lng: (0, _lodash8.default)(lngs), lat: (0, _lodash8.default)(lats) };

    if (shouldIgnoreLocation(ne) || shouldIgnoreLocation(sw)) {
      return;
    }

    this.context.map.fitBounds(_leaflet2.default.latLngBounds(_leaflet2.default.latLng(sw), _leaflet2.default.latLng(ne)));
  };

  HeatmapLayer.prototype.componentDidUpdate = function componentDidUpdate() {
    this.context.map.invalidateSize();
    if (this.props.fitBoundsOnUpdate) {
      this.fitBounds();
    }
    this.reset();
  };

  HeatmapLayer.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    return true;
  };

  HeatmapLayer.prototype.attachEvents = function attachEvents() {
    var _this3 = this;

    var leafletMap = this.context.map;
    leafletMap.on('viewreset', function () {
      return _this3.reset();
    });
    leafletMap.on('moveend', function () {
      return _this3.reset();
    });
    if (leafletMap.options.zoomAnimation && _leaflet2.default.Browser.any3d) {
      leafletMap.on('zoomanim', this._animateZoom, this);
    }
  };

  HeatmapLayer.prototype._animateZoom = function _animateZoom(e) {
    var scale = this.context.map.getZoomScale(e.zoom);
    var offset = this.context.map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this.context.map._getMapPanePos());

    if (_leaflet2.default.DomUtil.setTransform) {
      _leaflet2.default.DomUtil.setTransform(this._el, offset, scale);
    } else {
      this._el.style[_leaflet2.default.DomUtil.TRANSFORM] = _leaflet2.default.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
  };

  HeatmapLayer.prototype.reset = function reset() {
    var topLeft = this.context.map.containerPointToLayerPoint([0, 0]);
    _leaflet2.default.DomUtil.setPosition(this._el, topLeft);

    var size = this.context.map.getSize();

    if (this._heatmap._width !== size.x) {
      this._el.width = this._heatmap._width = size.x;
    }
    if (this._heatmap._height !== size.y) {
      this._el.height = this._heatmap._height = size.y;
    }

    if (this._heatmap && !this._frame && !this.context.map._animating) {
      this._frame = _leaflet2.default.Util.requestAnimFrame(this.redraw, this);
    }

    this.redraw();
  };

  HeatmapLayer.prototype.redraw = function redraw() {
    var r = this._heatmap._r;
    var size = this.context.map.getSize();

    var maxIntensity = this.props.max === undefined ? 1 : this.getMax(this.props);

    var maxZoom = this.props.maxZoom === undefined ? this.context.map.getMaxZoom() : this.getMaxZoom(this.props);

    var v = 1 / Math.pow(2, Math.max(0, Math.min(maxZoom - this.context.map.getZoom(), 12)));

    var cellSize = r / 2;
    var panePos = this.context.map._getMapPanePos();
    var offsetX = panePos.x % cellSize;
    var offsetY = panePos.y % cellSize;
    var getLat = this.props.latitudeExtractor;
    var getLng = this.props.longitudeExtractor;
    var getIntensity = this.props.intensityExtractor;

    var inBounds = function inBounds(p, bounds) {
      return bounds.contains(p);
    };

    var filterUndefined = function filterUndefined(row) {
      return (0, _lodash6.default)(row, function (c) {
        return c !== undefined;
      });
    };

    var roundResults = function roundResults(results) {
      return (0, _lodash4.default)(results, function (result, row) {
        return (0, _lodash2.default)(filterUndefined(row), function (cell) {
          return [Math.round(cell[0]), Math.round(cell[1]), Math.min(cell[2], maxIntensity), cell[3]];
        }).concat(result);
      }, []);
    };

    var accumulateInGrid = function accumulateInGrid(points, leafletMap, bounds) {
      return (0, _lodash4.default)(points, function (grid, point) {
        var latLng = [getLat(point), getLng(point)];
        if (isInvalidLatLngArray(latLng)) {
          //skip invalid points
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

    var data = getDataForHeatmap(this.props.points, this.context.map);

    this._heatmap.clear();
    this._heatmap.data(data).draw(this.getMinOpacity(this.props));

    this._frame = null;

    if (this.props.onStatsUpdate && this.props.points && this.props.points.length > 0) {
      this.props.onStatsUpdate((0, _lodash4.default)(data, function (stats, point) {
        stats.max = point[3] > stats.max ? point[3] : stats.max;
        stats.min = point[3] < stats.min ? point[3] : stats.min;
        return stats;
      }, { min: Infinity, max: -Infinity }));
    }
  };

  HeatmapLayer.prototype.render = function render() {
    return null;
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
