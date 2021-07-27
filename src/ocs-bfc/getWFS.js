import TileWFS from 'ol-ext/source/TileWFS'
import VectorImage from 'ol/layer/VectorImage'
import getStyle from '../ocs-ge/style'
import ProgressBar from 'ol-ext/control/ProgressBar'

// get source source
function getSource(type) {
  var source = new TileWFS({
    url: 'https://wxs.ign.fr/bx2thym8mdaruj2dg6ogfsi0/geoportail/wfs',
    typeName: type,
    tileZoom: 15,
    featureLimit: 20000
  });
  source.on('overload', (e) => console.log(e) );
  return source;
}

/** getWFS
 * @param {Map} map
 * @param {string} type wfs typename
 */
export default function(map, date) {
  const layer = new VectorImage({
    title: 'OCS-GE',
    className: 'blend',
    source: getSource(date === 2011 ? 'OCS.BFC.2011:ocsge_58_2011_20p' : 'OCS.BFC.2017:ocsge_58_2017_man_20p'),
    style: getStyle,
    opacity: 1,
    minZoom: 13  // prevent load on small zoom 
  });
  map.addLayer(layer);
  map.addControl(new ProgressBar({ 
    layers: layer
  }));
  return layer;
}

/** getWFS
 * @param {Map} map
 * @param {string} type wfs typename
 */
function getIndicator(map, date) {
  const layer = new VectorImage({
    title: 'Indicateur 9',
    className: 'blend',
    source: getSource('OCS.BFC.'+date+':indicateur9_'+date),
    // style: getStyle,
    opacity: 1,
    minZoom: 13  // prevent load on small zoom 
  });
  map.addLayer(layer);
  map.addControl(new ProgressBar({ 
    layers: layer
  }));
  return layer;
}

export { getIndicator } 
