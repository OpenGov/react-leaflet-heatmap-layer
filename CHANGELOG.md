# 2.0.0 Release
- React-leaflet v2.x support. For react-leaflet v1.x please use react-leaflet-heatmep-layer v1.x.

# 1.0.4 Release
- Allow the latest versions of `react` and `react-dom` (i.e. 16 and up).

# 1.0.3 Release
- Fixed warning "Accessing PropTypes via the main React package is deprecated"

# 1.0.2 Release
- Fix bug where radius, blur, and max were not being used when passed in as props.

# 1.0.1 Release
- Fix bug in componentWillUnmount->safeRemoveLayer where getPanes doesn't return anything so .contains is called on undefined. 

# 1.0.0 Release
- Leaflet 1.0.0 support
- React-Leaflet 1.0.0 support
- List eslint as an explicit devDependency
- upgrade the eslint related packages
- fix linting errors using current config
- Add notes about maintaining absence of lint errors and warnings in Contributing guide
- This should make it easier to ensure code quality as others contribute in the open
- Also, drop unused jest and enzyme deps

# 0.2.3 Release
- Missed Transpilation

# 0.2.2 Release
- Change `getHeatmapProps` signature to take a `props` argument to support passing `nextProps` from `componentWillReceiveProps` and `this.props` from `componentDidMount`

# 0.2.1 Release

- Fix getMaxZoom returning props.radius instead of props.maxZoom, fix misnamed call to getMax instead of getMaxZoom in redraw()

# 0.2.0 Release

- adds an `onStatsUpdate` prop which is called on redraw with a { min, max } object containing the min and max number of items found for a single coordinate

# 0.1.0 Release

- Handle invalid points gracefully
- Add `fitBoundsOnUpdate` prop to indicate that the map should fit the data in the map on update

# 0.0.2 Release

- Fix an issue with the gradient property being applied

# 0.0.1 Release

- Initial implementation of package
