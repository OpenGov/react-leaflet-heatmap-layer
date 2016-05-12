import React from 'react';
import ReactDOM from 'react-dom';
import map from 'lodash.map';
import reduce from 'lodash.reduce';
import forEach from 'lodash.foreach';
import pluck from 'lodash.pluck';
import filter from 'lodash.filter';
import min from 'lodash.min';
import max from 'lodash.max';
import isNumber from 'lodash.isnumber';
import L from 'leaflet';
import { MapLayer } from 'react-leaflet';
import simpleheat from 'simpleheat';

export type LngLat = {
  lng: number;
  lat: number;
}

export type Point = {
  x: number;
  y: number;
}

export type Bounds = {
  contains: (latLng: LngLat) => boolean;
}

export type Map = {
  layerPointToLatLng: (lngLat: Point) => LngLat;
  latLngToLayerPoint: (lngLat: LngLat) => Point;
  on: (event: string, handler: () => void) => void;
  getBounds: () => Bounds;
  getPanes: () => Panes;
  invalidateSize: () => void;
  options: Object;
}

export type Panes = {
  overlayPane: Pane;
}

export type Pane = {
  appendChild: (element: Object) => void;
}

export type LeafletZoomEvent = {
  zoom: number;
  center: Object;
}

function isValidLatLngArray(arr: Array<number>): boolean {
  return filter(arr, isValid).length === arr.length;
}

function isInvalidLatLngArray(arr: Array<number>): boolean {
  return !isValidLatLngArray(arr);
}

function isInvalid(num: number): boolean {
  return !isNumber(num) && !num;
}

function isValid(num: number): boolean {
  return !isInvalid(num);
}

function shouldIgnoreLocation(loc: LngLat): boolean {
  return isInvalid(loc.lng) || isInvalid(loc.lat);
}

export default class HeatmapLayer extends MapLayer {
  static propTypes = {
    points: React.PropTypes.array.isRequired,
    longitudeExtractor: React.PropTypes.func.isRequired,
    latitudeExtractor: React.PropTypes.func.isRequired,
    intensityExtractor: React.PropTypes.func.isRequired,
    fitBoundsOnLoad: React.PropTypes.bool,
    fitBoundsOnUpdate: React.PropTypes.bool,
    /* props controlling heatmap generation */
    max: React.PropTypes.number,
    radius: React.PropTypes.number,
    maxZoom: React.PropTypes.number,
    minOpacity: React.PropTypes.number,
    blur: React.PropTypes.number,
    gradient: React.PropTypes.object
  };

  componentDidMount(): void {
    this.leafletElement = ReactDOM.findDOMNode(this.refs.container);
    this.props.map.getPanes().overlayPane.appendChild(this.leafletElement);
    this._heatmap = simpleheat(this.leafletElement);

    if (this.props.fitBoundsOnLoad) {
      this.fitBounds();
    }

    this.attachEvents();
    this.updateHeatmapProps(this.getHeatmapProps());
    this.reset();
  }

  getMax(props) {
    return props.max || 3.0;
  }

  getRadius(props) {
    return props.radius || 30;
  }

  getMaxZoom(props) {
    return props.radius || 18;
  }

  getMinOpacity(props) {
    return props.minOpacity || 0.01;
  }

  getBlur(props) {
    return props.blur || 15;
  }

  getHeatmapProps() {
    return {
      minOpacity: this.getMinOpacity(this.props),
      maxZoom: this.getMaxZoom(this.props),
      radius: this.getRadius(this.props),
      blur: this.getBlur(this.props),
      max: this.getMax(this.props),
      gradient: this.props.gradient
    };
  }

  componentWillReceiveProps(nextProps: Object): void {
    this.updateHeatmapProps(this.getHeatmapProps(nextProps));
  }

  updateHeatmapProps(nextProps: Object) {
    if (nextProps.radius
      && (!this.props || nextProps.radius !== this.props.radius)) {
      this._heatmap.radius(nextProps.radius);
    }

    if (nextProps.gradient) {
      this._heatmap.gradient(nextProps.gradient);
    }

    if (nextProps.max
      && (!this.props || nextProps.max !== this.props.max)) {
      this._heatmap.max(nextProps.max);
    }
  }

  componentWillUnmount(): void {
    this.props.map.getPanes().overlayPane.removeChild(this.leafletElement);
  }

  fitBounds(): void {
    const points = this.props.points;
    const lngs = map(points, this.props.longitudeExtractor);
    const lats = map(points, this.props.latitudeExtractor);
    const ne = { lng: max(lngs), lat: max(lats) };
    const sw = { lng: min(lngs), lat: min(lats) };

    if (shouldIgnoreLocation(ne) || shouldIgnoreLocation(sw)) {
      return;
    }

    this.props.map.fitBounds(L.latLngBounds(L.latLng(sw), L.latLng(ne)));
  }

  componentDidUpdate(): void {
    this.props.map.invalidateSize();
    if (this.props.fitBoundsOnUpdate) {
      this.fitBounds();
    }
    this.reset();
  }

  shouldComponentUpdate(): boolean {
    return true;
  }

  attachEvents(): void {
    const map: Map = this.props.map;
    map.on('viewreset', () => this.reset());
    map.on('moveend', () => this.reset());
    if (map.options.zoomAnimation && L.Browser.any3d) {
        map.on('zoomanim', this._animateZoom, this);
    }
  }


  _animateZoom(e: LeafletZoomEvent): void {
    const scale = this.props.map.getZoomScale(e.zoom);
    const offset = this.props.map
                      ._getCenterOffset(e.center)
                      ._multiplyBy(-scale)
                      .subtract(this.props.map._getMapPanePos());

    if (L.DomUtil.setTransform) {
        L.DomUtil.setTransform(this.refs.container, offset, scale);
    } else {
        this.refs.container.style[L.DomUtil.TRANSFORM] =
          L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
  }

  reset(): void {
    const topLeft = this.props.map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.refs.container, topLeft);

    const size = this.props.map.getSize();

    if (this._heatmap._width !== size.x) {
        this.refs.container.width = this._heatmap._width  = size.x;
    }
    if (this._heatmap._height !== size.y) {
        this.refs.container.height = this._heatmap._height = size.y;
    }

    if (this._heatmap && !this._frame && !this.props.map._animating) {
        this._frame = L.Util.requestAnimFrame(this.redraw, this);
    }

    this.redraw();
  }

  redraw(): void {
    const r = this._heatmap._r;
    const size = this.props.map.getSize();

    const maxIntensity = this.props.max === undefined
                            ? 1
                            : this.getMax(this.props);

    const maxZoom = this.props.maxZoom === undefined
                        ? this.props.map.getMaxZoom()
                        : this.getMax(this.props);

    const v = 1 / Math.pow(
      2,
      Math.max(0, Math.min(maxZoom - this.props.map.getZoom(), 12))
    );

    const cellSize = r / 2;
    const grid = [];
    const panePos = this.props.map._getMapPanePos();
    const offsetX = panePos.x % cellSize;
    const offsetY = panePos.y % cellSize;
    const getLat = this.props.latitudeExtractor;
    const getLng = this.props.longitudeExtractor;
    const getIntensity = this.props.intensityExtractor;

    const inBounds = (p, bounds) => bounds.contains(p);

    const filterUndefined = (r) => filter(r, c => c !== undefined);

    const roundResults = (results) => {
      return reduce(results, (result, row) => {
        return map(filterUndefined(row), (cell, key, row) => {
          return [
            Math.round(cell[0]),
            Math.round(cell[1]),
            Math.min(cell[2], maxIntensity)
          ];
        }).concat(result);
      }, []);
    };

    const accumulateInGrid = (points, leafletMap, bounds) => {
      return reduce(points, (grid, point) => {
        const latLng = [getLat(point), getLng(point)];
        if (isInvalidLatLngArray(latLng)) { //skip invalid points
          return grid;
        }

        const p = leafletMap.latLngToContainerPoint(latLng);

        if (!inBounds(p, bounds)) {
          return grid;
        }

        const x = Math.floor((p.x - offsetX) / cellSize) + 2;
        const y = Math.floor((p.y - offsetY) / cellSize) + 2;

        grid[y] = grid[y] || [];
        const cell = grid[y][x];

        const alt = getIntensity(point);
        const k = alt * v;

        if (!cell) {
            grid[y][x] = [p.x, p.y, k];
        } else {
            cell[0] = (cell[0] * cell[2] + p.x * k) / (cell[2] + k); // x
            cell[1] = (cell[1] * cell[2] + p.y * k) / (cell[2] + k); // y
            cell[2] += k; // accumulated intensity value
        }

        return grid;
      }, []);
    }

    const getBounds = (leafletMap) => {
      return new L.Bounds(L.point([-r, -r]), size.add([r, r]))
    };

    const getDataForHeatmap = (points, leafletMap) => {
      return roundResults(
        accumulateInGrid(
          points,
          leafletMap,
          getBounds(leafletMap)
        )
      );
    }
    const data = getDataForHeatmap(this.props.points, this.props.map);

    this._heatmap.clear();
    this._heatmap.data(data).draw(this.getMinOpacity(this.props));

    this._frame = null;
  }


  render(): React.Element {
    const mapSize = this.props.map.getSize();
    const transformProp = L.DomUtil.testProp(
      ['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']
    );
    const canAnimate = this.props.map.options.zoomAnimation && L.Browser.any3d;
    const zoomClass = `leaflet-zoom-${canAnimate ? 'animated' : 'hide'}`;

    const canvasProps = {
      className: `leaflet-heatmap-layer leaflet-layer ${zoomClass}`,
      style: {
        [transformProp]: '50% 50%'
      },
      width: mapSize.x,
      height: mapSize.y
    };

    return (
      <canvas ref="container" {...canvasProps} />
    );
  }

}
