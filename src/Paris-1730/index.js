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
    new Geoportail({ layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2' }),
    new Tile({ title: 'OSM', source: new OSM(), visible: false })
  ],
  view: new View({
    center: [0, 0],
    zoom: 0
  })
});
  
var paris_1730 = new Tile({
  title: 'Paris 1730',
  extent: [246374, 6240517, 272780, 6260149],
  source: new XYZ({
    url: 'https://viglino.github.io/maps/data/paris1700/ark-12148-btv1b10060188s_{z}-{x}-{y}.png',
    minZoom: 11,
    maxZoom: 15,
    tileSize: 512,
    attributions: ['&copy; <a href="https://www.data.gouv.fr/fr/datasets/carte-ancienne-de-la-minute-ouessant-le-four-les-pierres-noires/">SHOM</a>']
  })
});
map.addLayer(paris_1730);
map.getView().fit(paris_1730.getExtent());

map.addControl(new LayerSwitcher());
/* Export for debug */
window.map = map;
/**/