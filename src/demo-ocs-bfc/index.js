import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './index.css'

import getMap from '../ocs-ge/map/getMap'
const map1 = getMap(2011, [351328, 5940916])

import getWFS from '../ocs-bfc/getWFS'
const couverture = getWFS(map1, 2011, 'Couverture');
couverture.setVisible(false)
couverture.set('displayInLayerSwitcher', false);

import { getUsageStyle } from '../ocs-ge/style'
const usage = getWFS(map1, 2011, 'Usage');
usage.setStyle(getUsageStyle);
usage.setVisible(false)
usage.set('displayInLayerSwitcher', false);

/*
couverture.on('change:visible', () => {
  usage.setVisible(!couverture.getVisible());
});
usage.on('change:visible', () => {
  couverture.setVisible(!usage.getVisible());
});
*/

import { getIndicator } from '../ocs-bfc/getWFS'
const indicator1 = getIndicator(map1, '2011');

/* Switcher */
const layers = [couverture, usage, indicator1]
document.getElementById('indicateur').addEventListener('change', function() {
  layers.forEach(l => {
    l.setVisible(l.get('title') === this.value);
    l.set('displayInLayerSwitcher', l.get('title') === this.value);
  });
});

import getCommunes from '../ocs-bfc-flux/getCommunes'
const communes1 = getCommunes(map1, 2011);

import getStat from '../ocs-bfc-flux/calcStat';
const stat1 = getStat('stat1');

import Select from 'ol/interaction/Select'
const sel1 = new Select({ layers: [ communes1 ] });
map1.addInteraction(sel1);

const title = document.getElementById('title')
sel1.on('select', e => {
  const f = e.selected[0];
  if (f) {
    title.innerText = f.get('nom_com');
    stat1.show(f.get('flux'));
  } else {
    title.innerText = '';
    stat1.show();
  }
})

import getHover from '../ocs-ge/map/getHover'
getHover(map1, [indicator1]);
