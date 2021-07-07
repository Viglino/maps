import TileWFS from 'ol-ext/source/TileWFS'
import element from 'ol-ext/util/element'
import VectorImage from 'ol/layer/VectorImage'
import getStyle from '../style'
import ProgressBar from 'ol-ext/control/ProgressBar'

// get source source
function getSource(type) {
  var source = new TileWFS({
    url: 'https://wxs.ign.fr/qvo9gdluu6vvf98hplg8iz5n/geoportail/wfs',
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
    source: getSource('OCSGE.TEST:ocs_ge_arcachon_'+date+'_20201117'),
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