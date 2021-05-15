import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './index.css'
import Map from 'ol/Map'
import View from 'ol/View';
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import Geoportail from 'ol-ext/layer/Geoportail'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'

const map = new Map({
  target: 'map',
  layers: [
    new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS', visible: false }),
    new Geoportail({ layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', gppKey: 'h1osiyvfm7c4wu976jv6gpum' }),
    new Tile({ title: 'OSM', source: new OSM(), visible: false })
  ],
  view: new View({
    center: [0, 0],
    zoom: 0
  })
});
  
var molene = new Tile({
  title: 'Minute Ouessant',
  extent: [-562641, 6161952, -539707, 6177630],
  source: new XYZ({
    url: './molene/data/molene_{z}-{x}-{y}.png',
    minZoom: 11,
    maxZoom: 15,
    tileSize: 512,
    attributions: ['&copy; <a href="https://www.data.gouv.fr/fr/datasets/carte-ancienne-de-la-minute-ouessant-le-four-les-pierres-noires/">SHOM</a>']
  })
});
map.addLayer(molene);
map.getView().fit(molene.getExtent());

map.addControl(new LayerSwitcher());
/* Export for debug */
window.map = map;
/**/