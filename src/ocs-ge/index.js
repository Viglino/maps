import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './index.css'
import Synchronize from 'ol-ext/interaction/Synchronize'

import getMap from './map/getMap'
import getWFS from './map/getWFS'
import getHover from './map/getHover'
import calcStat from './calcStat'
import clipCircle from './map/clipCircle'

const map1 = getMap(2015);
const map2 = getMap(2018);

const vector1 = getWFS(map1, '2015');
const vector2 = getWFS(map2, '2018');

map1.addInteraction(new Synchronize({ maps: [map2] }));
map2.addInteraction(new Synchronize({ maps: [map1] }));

/*
import getCommune from './map/getCommune'
getCommune(map1);
getCommune(map2);
*/
const clip = clipCircle(map1, map2);
clip.setActive(false);

getHover(map1);
getHover(map2);

const chart1 = calcStat('stat1', map1, vector1.getSource(), clip);
const chart2 = calcStat('stat2', map2, vector2.getSource(), clip);

document.querySelector('#mode select').addEventListener('change', () => {
  chart1.refresh();
  chart2.refresh();
});

import Select from 'ol/interaction/Select'
const sel = new Select();
map1.addInteraction(sel);
sel.on('select', (e) => {
  const f = e.selected[0];
  sel.getFeatures().clear();
  if (f) console.log(f.getProperties());
})

/* DEBUG */
window.map = map1;
window.vector = vector1;
window.clip = clip;
/**/