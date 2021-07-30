import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import { getIndex } from './calcStat'

const couverture = {
  'CS1.1.1.1': { name: 'Zones bâties', color: '#ff377a' },
  'CS1.1.1.2': { name: 'Zones non bâties', color: '#ff9191', desc: 'route, places, parking' },
  'CS1.1.2.1': { name: 'Zones à Matériaux minéraux Pierre-terre', color: '#ffff99', desc: 'voie ferrée, piste forestière, chemin empierrés, chantiers, carrières, salines…' },
  'CS1.1.2.2': { name: 'Zones à autres matériaux composites', color: '#a64d00', desc: 'décharges…' },
  'CS1.2.1':   { name: 'Sols nus', color: '#cccccc' },
  'CS1.2.2':   { name: 'Surfaces d’eau', color: '#00ccf2' },
  'CS2.1.1.1': { name: 'Peuplements de feuillus', color: '#80ff00' },
  'CS2.1.1.2': { name: 'Peuplements de conifères', color: '#00a600' },
  'CS2.1.1.3': { name: 'Peuplements mixtes', color: '#80be00' },
  'CS2.1.1':   { name: 'Formations arborées', color: [128, 255, 0] },
  'CS2.1.1.3': { name: 'Peuplements mixtes', color: [128, 190, 0] },
  'CS2.1.2':   { name: 'Formations arbustives et sous-arbrisseaux', color: '#e68000' },
  'CS2.1.3':   { name: 'Autres formations ligneuses', color: [230, 128, 0] },
  'CS2.1.3.1': { name: 'Vignes', color: '#a6ff80' },
  'CS2.1.3.2': { name: 'Autres lianes', color: '#e46d0a' },
  'CS2.2.1':   { name: 'Formations herbacées', color: [204, 242, 77] },
  'CS2.1.1.1': { name: 'Peuplements de feuillus', color: [128, 255, 0] },
  'CS2.1.1.2': { name: 'Peuplements de conifères', color: [0, 166, 0] },
  'CS2.2.1.1': { name: 'Prairies', color: '#6eff26' },
  'CS2.2.1.2': { name: 'Pelouses, herbe rase', color: '#93ff59' },
  'CS2.2.1.4': { name: 'Terres arables', color: '#fff03a' },
  'CS2.2.1.5': { name: 'Autres Formations herbacées', color: '#f2f24d' },
  'CS2.2.2':   { name: 'Autres formations non ligneuses', color: '#ccffcc' },
};

const styleCache = {};
for (let i in couverture) {
  styleCache[i] = new Style({
    fill: new Fill({
      color: couverture[i].color
    })
  })
}

const legendCheck = document.getElementById('legendCheck');
const mode = document.querySelector('#mode select');

/** Get couverture style
 */
function getStyle(feature) {
  const s = feature.get('couverture');
  if (legendCheck.checked) {
    if (!styleCache[s]) {
      console.log('Missing: ',s)
    } else {
      return styleCache[s];
    }
  } else {
    if (getIndex(s)) {
      return styleCache['CS2.1.1.3'];
    } else {
      return styleCache['CS1.1.1.2'];
    }
  }
}

export default getStyle
export {couverture}
