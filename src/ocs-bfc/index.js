import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import '../ocs-ge/index.css'
import './index.css'


import getMap from '../ocs-ge/map/getMap'
const map1 = getMap(2011, [351328, 5940916])
const map2 = getMap(2017, [351328, 5940916])

import getWFS, { getIndicator } from './getWFS'
const layer1 = getWFS(map1, 2011);
const layer2 = getWFS(map2, 2017);

const ind1 = getIndicator(map1, 2011);
const ind2 = getIndicator(map2, 2017);


import Synchronize from 'ol-ext/interaction/Synchronize'
map1.addInteraction(new Synchronize({ maps: [map2] }));
map2.addInteraction(new Synchronize({ maps: [map1] }));

import getHover from '../ocs-ge/map/getHover'
getHover(map1);
getHover(map2);

/* DEBUG */
window.map = map1
/* */