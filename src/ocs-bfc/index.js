import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import '../ocs-ge/index.css'
import './index.css'

/* only one map */
const oneMap = true;
if (oneMap) {
  document.body.className = "oneMap";
}

import getMap from '../ocs-ge/map/getMap'
const map1 = getMap(2011, [351328, 5940916])
const map2 = getMap(2017, [351328, 5940916])

import getWFS, { getCommunes } from './getWFS'
const layer1 = getWFS(map1, 2011, 'Couverture');
const layer2 = getWFS(map2, 2017, 'Couverture');
layer2.setVisible(false)

import { getUsageStyle } from '../ocs-ge/style'
const usage = getWFS(map2, 2017, 'Usage');
usage.setStyle(getUsageStyle);
usage.setVisible(false)

import { getIndicator } from '../ocs-bfc/getWFS'
const indicator1 = getIndicator(map2, '2017');

/*
const ind1 = getIndicator(map1, 2011);
const ind2 = getIndicator(map2, 2017);
*/
const communes1 = getCommunes(map1, 2011);
const communes2 = getCommunes(map2, 2017);
if (oneMap) {
  communes1.setOpacity(0);
  communes1.set('displayInLayerSwitcher', false);
  map1.removeLayer(communes1);
  map2.addLayer(communes1);
}

import Synchronize from 'ol-ext/interaction/Synchronize'
map1.addInteraction(new Synchronize({ maps: [map2] }));
map2.addInteraction(new Synchronize({ maps: [map1] }));

import getStat from './calcStat';
const stat1 = getStat('stat1');
const stat2 = getStat('stat2');

import getSelection from './getSelection'
getSelection(map1, communes1, stat1, map2, communes2, stat2);

import getHover from '../ocs-ge/map/getHover'
getHover(map1, [layer1]);
getHover(map2, [layer2]);

/* DEBUG */
window.map = map1
/* */