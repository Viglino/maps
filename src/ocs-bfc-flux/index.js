import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import '../ocs-ge/index.css'
import '../ocs-bfc/index.css'
import './index.css'

import LayerGroup from 'ol/layer/group'
import GeoportailLayer from './capabilities.js'

import getMap from '../ocs-ge/map/getMap'
const map1 = getMap(2011, [351328, 5940916])
const map2 = getMap(2017, [351328, 5940916])

import getWFS from '../ocs-bfc/getWFS'

// Couverture
const layer1 = getWFS(map1, 2011, 'Couverture', true);
layer1.set('displayInLayerSwitcher', false);
map1.addLayer(new LayerGroup({
  title: 'Couverture',
  layers: [
    layer1,
    new GeoportailLayer({
      className: 'WMS blend',
      layer: 'OCS.BFC.2011.couverture',
      maxZoom: 13,
      displayInLayerSwitcher: false,
      key: 'bx2thym8mdaruj2dg6ogfsi0'
    })
  ]
}));

const layer2 = getWFS(map2, 2017, 'Couverture', true);
layer2.set('displayInLayerSwitcher', false);
map2.addLayer(new LayerGroup({
  title: 'Couverture',
  layers: [
    layer2,
    new GeoportailLayer({
      className: 'WMS blend',
      layer: 'OCS.BFC.2017.couverture',
      maxZoom: 13,
      displayInLayerSwitcher: false,
      key: 'bx2thym8mdaruj2dg6ogfsi0'
    })
  ]
}));

// Usage
import { getUsageStyle } from '../ocs-ge/style'
const usage1 = getWFS(map1, 2011, 'Usage', false);
usage1.setStyle(getUsageStyle);
usage1.set('displayInLayerSwitcher', false);
map1.addLayer(new LayerGroup({
  title: 'Usage',
  visible: false,
  layers: [
    usage1,
    new GeoportailLayer({
      className: 'WMS blend',
      layer: 'OCS.BFC.2011.usage',
      maxZoom: 13,
      displayInLayerSwitcher: false,
      key: 'bx2thym8mdaruj2dg6ogfsi0'
    })
  ]
}));

const usage2 = getWFS(map2, 2017, 'Usage', true);
usage2.setStyle(getUsageStyle);
usage2.set('displayInLayerSwitcher', false);
map2.addLayer(new LayerGroup({
  title: 'Usage',
  visible: false,
  layers: [
    usage2,
    new GeoportailLayer({
      className: 'WMS blend',
      layer: 'OCS.BFC.2017.usage',
      maxZoom: 13,
      displayInLayerSwitcher: false,
      key: 'bx2thym8mdaruj2dg6ogfsi0'
    })
  ]
}));

// Communes
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
import ol_layer_Geoportail from 'ol-ext/layer/Geoportail'
getHover(map1, [layer1]);
getHover(map2, [layer2]);
getHover(map1, [usage1], 'usage');
getHover(map2, [usage2], 'usage');

/* DEBUG */
window.map = map1
/* */