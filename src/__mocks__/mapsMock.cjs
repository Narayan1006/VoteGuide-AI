// Google Maps CJS mock
const React = require('react');

module.exports = {
  GoogleMap:    ({ children }) => React.createElement('div', { 'data-testid': 'google-map' }, children),
  LoadScript:   ({ children, onLoad }) => {
    if (onLoad) setTimeout(onLoad, 0);
    return React.createElement('div', { 'data-testid': 'load-script' }, children);
  },
  Marker:       ({ onClick, title }) =>
    React.createElement('button', { 'data-testid': 'map-marker', onClick, 'aria-label': title }),
  InfoWindow:   ({ children, onCloseClick }) =>
    React.createElement('div', { 'data-testid': 'info-window', onClick: onCloseClick }, children),
  useJsApiLoader: () => ({ isLoaded: true, loadError: null }),
};
