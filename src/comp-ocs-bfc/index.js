import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import '../ocs-ge/index.css'
import './index.css'

import getMap from '../ocs-ge/map/getMap'
const map2 = getMap(2017, [351328, 5940916])

import getWFS, { getCommunes } from '../ocs-bfc/getWFS'
const couverture = getWFS(map2, 2017, 'Couverture');
couverture.setVisible(false)

import { getUsageStyle } from '../ocs-ge/style'
const usage = getWFS(map2, 2017, 'Usage');
usage.setStyle(getUsageStyle);
usage.setVisible(false)

import { getIndicator } from '../ocs-bfc/getWFS'
const indicator1 = getIndicator(map2, '2017');

const communes2 = getCommunes(map2, 2017);

import getStat from './calcStat';
const stat1 = getStat('stat1');
const stat2 = getStat('stat2');

import Select from 'ol/interaction/select'
import { click } from 'ol/events/condition'
const sel = new Select({ layers: [communes2], condition: click });
map2.addInteraction(sel);

const title1 = document.querySelector('#stat1 h1');
const title2 = document.querySelector('#stat2 h1');
function showStat(f, stat, title) {
  if (f) {
    const insee = f.get('insee_com');
    console.log(insee, f.get('nom_com'));
    title.innerText = f.get('nom_com');
    const cs = f.getProperties();
    const stats = {};
    for (let c in cs) {
      if (/^CS/.test(c) /* && cs[c] */) {
        stats[c] = cs[c];
      }
    }
    stat.show(stats);
  }
}

sel.on('select', (e) =>  {
  const nb = sel.getFeatures().getLength();
  showStat(sel.getFeatures().item(0), stat1, title1);
  if (nb>1) showStat(sel.getFeatures().item(nb-1), stat2, title2);
});
