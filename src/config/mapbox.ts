/**
 * Mapbox GL JS Configuration
 *
 * This file contains the Mapbox access token and configuration.
 * The token is used to authenticate with Mapbox's mapping services.
 *
 * Free tier: 50,000 map loads per month
 * Features: 3D buildings, terrain, custom markers, dark themes
 */

export const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXBwc3BmbHVnZXIiLCJhIjoiY21od2t0NTZwMDBvNjJqcTFoYmV3bzFwYyJ9.7bIyUK74swnmvzPfVBkKmw';

/**
 * Mapbox style URLs for different themes
 * Standard Night style is used for EZRA - has built-in 3D buildings
 */
export const MAPBOX_STYLES = {
  standardNight: 'mapbox://styles/mapbox/standard',
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/light-v11',
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
};

/**
 * Default map configuration
 */
export const MAP_CONFIG = {
  center: [-97.7431, 30.2672] as [number, number], // Austin, Texas
  zoom: 5,
  pitch: 30, // 3D perspective angle - sweet spot for 3D buildings with map readability
  bearing: 0, // Map rotation
  minZoom: 3,
  maxZoom: 18
};
