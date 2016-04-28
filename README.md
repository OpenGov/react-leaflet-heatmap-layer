# react-leaflet-heatmap-layer

`react-leaflet-heatmap-layer` provides a simple `<HeatmapLayer />` component for creating a heatmap layer in a `react-leaflet` map.

![A screenshot of a heatmap on a leaflet map](../master/screenshot.jpg?raw=true)

## Usage

```js
import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../src/HeatmapLayer';
import { addressPoints } from './realworld.10000.js';

class MapExample extends React.Component {

  render() {
    return (
      <div>
        <Map center={[0,0]} zoom={13}>
          <HeatmapLayer
            fitBoundsOnLoad
            points={addressPoints}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2])} />
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>
      </div>
    );
  }

}

render(<MapExample />, document.getElementById('app'));
```

## API

The `HeatmapLayer` component takes the following props:

- `points`: *required* an array of objects to be processed
- `longitudeExtractor`: *required* a function that returns the object's longitude e.g. `marker => marker.lng`
- `latitudeExtractor`: *required* a function that returns the object's latitude e.g. `marker => marker.lat`
- `intensityExtractor`: *required* a function that returns the object's intensity e.g. `marker => marker.val`
- `fitBoundsOnLoad`: boolean indicating whether map should fit data in bounds of map on load
- `max`: max intensity value for heatmap (default: 3.0)
- `radius`: radius for heatmap points (default: 30)
- `maxZoom`: maximum zoom for heatmap (default: 18)
- `minOpacity`: minimum opacity for heatmap (default: 0.01)
- `blur`: blur for heatmap points (default: 15)
- `gradient`: object defining gradient stop points for heatmap e.g. `{ 0.4: 'blue', 0.8: 'orange', 1.0: 'red' }` (default: `simpleheat` package default gradient)

## Example

To try the example:

1. Clone this repository
2. run `npm install` in the root of your cloned repository
3. run `npm run example`
4. Visit [localhost:8000](http://localhost:8000)

## Contributing

See [CONTRIBUTING.md](https://www.github.com/OpenGov/react-leaflet-heatmap-layer/blob/master/CONTRIBUTING.md)

## Credits

This package was inspired by [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat).

## License

`react-leaflet-heatmap-layer` is MIT licensed.

See [LICENSE.md](https://www.github.com/OpenGov/react-leaflet-heatmap-layer/blob/master/LICENSE.md) for details.
