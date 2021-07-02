import TileWFS from 'ol-ext/source/TileWFS'
import element from 'ol-ext/util/element'
import VectorImage from 'ol/layer/VectorImage'
import getStyle from '../style'
import ProgressBar from 'ol-ext/control/ProgressBar'

// get source source
function getSource(type) {
  // Loading bar
  var progressbar = document.getElementById('progressbar');
  var progress = function(e) {
    /*
    if (e.loading === e.loaded) {
      element.setStyle(progressbar, { width: 0 });
      $('#loading').hide();
      calculate(true);
    } else {
      element.setStyle(progressbar, { width: (e.loaded / e.loading * 100).toFixed(1) + '%' });
      $('#loading').show();
      $('#loading span').text(e.loaded+'/'+e.loading)
    }
    */
  }
  var source = new TileWFS({
    url: 'https://wxs.ign.fr/qvo9gdluu6vvf98hplg8iz5n/geoportail/wfs',
    typeName: type,
    tileZoom: 15,
    featureLimit: 20000
  });
  source.on(['tileloadstart','tileloadend', 'tileloaderror'], progress);
  source.on('overload', (e) => console.log(e) );
  return source;
}

/** getWFS
 * @param {Map} map
 * @param {string} type wfs typename
 */
export default function(map, date) {
  const layer = new VectorImage({
    title: 'OSG-GE',
    className: 'blend',
    //source: getSource('CARTOGRAPHIE.PHYSIONOMIES:fond_physio_25_v2_valide'),
    // source: getSource('OCSGE.TEST:ocs_ge_arcachon_2015_20201117'),
    //source: getSource('OCSGE.TEST:ocs_ge_arcachon_2018_20201117'),
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