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
