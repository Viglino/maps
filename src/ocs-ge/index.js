import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './index.css'
import Synchronize from 'ol-ext/interaction/Synchronize'
import ProgressBar from 'ol-ext/control/ProgressBar'

import getMap from './map/getMap'
import getWFS from './map/getWFS'
import getHover from './map/getHover'
import calcStat from './calcStat'

const map1 = getMap('map1', true);
const map2 = getMap('map2');

const vector1 = getWFS('OCSGE.TEST:ocs_ge_arcachon_2015_20201117');
map1.addLayer(vector1);
map1.addControl(new ProgressBar({ 
  layers: vector1
}));

const vector2 = getWFS('OCSGE.TEST:ocs_ge_arcachon_2018_20201117');
map2.addLayer(vector2);
map2.addControl(new ProgressBar({ 
  layers: vector2
}));

map1.addInteraction(new Synchronize({ maps: [map2] }));
map2.addInteraction(new Synchronize({ maps: [map1] }));

getHover(map1);
getHover(map2);

calcStat('stat1', map1, vector1.getSource());
calcStat('stat2', map2, vector2.getSource());

window.map = map1;
window.vector = vector1;