import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../src/HeatmapLayer';
import { addressPoints } from './realworld.10000.js';

class MapExample extends React.Component {

  state = {
    mapHidden: false,
    layerHidden: false,
    addressPoints: addressPoints
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ addressPoints: addressPoints.slice(500, 1000) });
    }, 5000);
  }

  render() {
    if (this.state.mapHidden) {
      return (
        <div>
          <input
            type="button"
            value="Toggle Map"
            onClick={() => this.setState({ mapHidden: !this.state.mapHidden })} />
        </div>
      );
    }
    const gradient = { '0.1': '#89BDE0', '0.2': '#96E3E6', '0.4': '#82CEB6', '0.6': '#FAF3A5', '0.8': '#F5D98B', '1.0': '#DE9A96'};

    return (
      <div>
        <Map center={[0,0]} zoom={13}>
          {!this.state.layerHidden &&
              <HeatmapLayer
              fitBoundsOnLoad
              fitBoundsOnUpdate
              points={this.state.addressPoints}
              longitudeExtractor={m => m[1]}
              latitudeExtractor={m => m[0]}
              gradient={gradient}
              intensityExtractor={m => parseFloat(m[2])} />
            }
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>
        <input
          type="button"
          value="Toggle Map"
          onClick={() => this.setState({ mapHidden: !this.state.mapHidden })} />
        <input
          type="button"
          value="Toggle Layer"
          onClick={() => this.setState({ layerHidden: !this.state.layerHidden })} />
      </div>
    );
  }

}

render(<MapExample />, document.getElementById('app'));
