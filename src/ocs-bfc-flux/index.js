import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import '../ocs-ge/index.css'
import '../ocs-bfc/index.css'
import './index.css'


import getMap from '../ocs-ge/map/getMap'
const map1 = getMap(2011, [351328, 5940916])
const map2 = getMap(2017, [351328, 5940916])

import getWFS from '../ocs-bfc/getWFS'
const layer1 = getWFS(map1, 2011);
const layer2 = getWFS(map2, 2017);

import getCommunes from './getCommunes'
const communes1 = getCommunes(map1, 2011);
const communes2 = getCommunes(map2, 2017);

import Synchronize from 'ol-ext/interaction/Synchronize'
map1.addInteraction(new Synchronize({ maps: [map2] }));
map2.addInteraction(new Synchronize({ maps: [map1] }));

import getStat from './calcStat';
const stat1 = getStat('stat1');

import getSelection from './getSelection'
getSelection(map1, communes1, map2, communes2, stat1);

/*
import getStat from './calcStat';
const stat1 = getStat('stat1');
const stat2 = getStat('stat2');

import getSelection from './getSelection'
getSelection(map1, communes1, stat1, map2, communes2, stat2);
*/

import getHover from '../ocs-ge/map/getHover'
import ol_control_CanvasBase from 'ol-ext/control/CanvasBase'
import { Chart } from 'chart.js'
getHover(map1, [layer1]);
getHover(map2, [layer2]);

/* DEBUG */
window.map = map1
/* */