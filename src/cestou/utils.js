/** Get the extent of a geometry
 * @param {Object} geom - The geometry object (GeoJSON format)
 * @returns {Array} extent - An array containing the extent [minX, minY, maxX, maxY]
 */
function getExtent(geom) {
  if (geom.type === 'Polygon') {
    geom = geom.coordinates[0];
  } else if (geom.type === 'MultiPolygon') {
    geom = geom.coordinates[0][0];
  } else if (geom.type === 'Point') {
    geom = [geom.coordinates];
  } else if (geom.type === 'LineString') {
    geom = geom.coordinates;
  }
  const extent = [+Infinity, +Infinity, -Infinity, -Infinity];
  geom.forEach(coord => {
    if (coord[0] < extent[0] || !extent[0]) extent[0] = coord[0];
    if (coord[1] < extent[1] || !extent[1]) extent[1] = coord[1];
    if (coord[0] > extent[2] || !extent[2]) extent[2] = coord[0];
    if (coord[1] > extent[3] || !extent[3]) extent[3] = coord[1];
  });
  return extent
}

/** Get the center of a geometry
 * @param {Object} geom - The geometry object (GeoJSON format)
 * @returns {Array} center - An array containing the center [longitude, latitude]
 */
function getCenter(geom) {
  const extent = getExtent(geom);
  return [(extent[0] + extent[2]) /2, (extent[1] + extent[3]) /2];
}

/** Get the distance between two coordinates
 * This uses the Haversine formula to calculate the distance between two points on the Earth
 * It assumes the Earth is a perfect sphere, which is a good approximation for small distances.
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 * @param {Array} coord1 - First coordinate [longitude, latitude]
 * @param {Array} coord2 - Second coordinate [longitude, latitude]
 * @return {number} distance - Distance in meters
 */
function getDistance(coord1, coord2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371e3; // Rayon de la Terre en mètres
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);
  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

/** Get km string
 * @param {number} dist - Distance in meters
 */
function toKMString(dist) {
  // Convert distance to kilometers
  if (dist > 1000) {
    dist = Math.round(dist / 100) / 10 + ' km'; // arrondi à 0.1 km
  } else {
    dist = Math.round(dist) + ' m'; // arrondi à l'entier
  }
  return dist
}

function getNearest(pt, features) {
  let d = Infinity;
  let pos = 0;
  features.forEach((f, i) => {
    const di = getDistance(pt, getCenter(f.geometry))
    if (di<d) pos = i;
  })
  return pos
}

export { getExtent, getCenter, getDistance, toKMString, getNearest };