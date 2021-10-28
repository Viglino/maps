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
  'CS2.1.1':   { name: 'Formations arborées', color: '#80ff00' },
  'CS2.1.1.3': { name: 'Peuplements mixtes', color: '#80be00' },
  'CS2.1.2':   { name: 'Formations arbustives et sous-arbrisseaux', color: '#e68000' },
  'CS2.1.3':   { name: 'Autres formations ligneuses', color: '#e68000' },
  'CS2.1.3.1': { name: 'Vignes', color: '#a6ff80' },
  'CS2.1.3.2': { name: 'Autres lianes', color: '#e46d0a' },
  'CS2.2.1':   { name: 'Formations herbacées', color: '#ccf24d' },
  'CS2.1.1.1': { name: 'Peuplements de feuillus', color: '#80ff00' },
  'CS2.1.1.2': { name: 'Peuplements de conifères', color: '#00a600' },
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

const usage = {
  'US1.1.3': { name: 'Surface agricole utilisée', color: '#ffffa8'},
  'US1.1.4': { name: 'Jachère', color: '#ead74a' },
  'US1.2': { name: 'Sylviculture', color: '#008000' },
  'US1.2.1.2': { name: 'Peupleraie', color: '#89f200' },
  'US1.3': { name: ' Activité d\'extraction', color: '#a600cc' },
  'US1.4': { name: 'Aquaculture et pêche', color: '#000099' },
  'US1.5': { name: ' Autre production primaire', color: '#996633' },
  'US2': { name: 'Production secondaire', color: '#e6004d' },
  'US3': { name: 'Production tertiaire', color: '#ff8c00' },
  'US4.1.1': { name: 'Transport Routier', color: '#cc0000' },
  'US4.1.2': { name: 'Transport Ferré', color: '#5a5a5a' },
  'US4.1.3': { name: 'Transport Aérien', color: '#e6cce6' },
  'US4.1.4': { name: 'Transport par voie navigable', color: '#0066ff' },
  'US4.1.5': { name: 'Autres réseaux de transport', color: '#660033' },
  'US4.2': { name: 'Services logistiques et de stockage', color: '#ff0000' },
  'US4.3': { name: 'Réseaux d\'utilité publique', color: '#ff4b00' },
  'US5': { name: 'Usage résidentiel', color: '#be0961' },
  'US6.1': { name: 'Zones en transition', color: '#ff4dff' },
  'US6.2': { name: 'Zones abandonnées', color: '#404040' },
  'US6.3': { name: 'Sans usage', color: '#f0f028' },
  'US6.4': { name: 'Usage inconnu', color: '#ffcc00' }
}
const usageCache = {};
for (let i in usage) {
  usageCache[i] = new Style({
    fill: new Fill({
      color: usage[i].color
    })
  })
}

const legendCheck = document.getElementById('legendCheck');

/** Get couverture style
 */
function getStyle(feature) {
  const s = feature.get('couverture');
  if (!legendCheck || legendCheck.checked) {
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

/** Get usage style
 */
function getUsageStyle(feature) {
  const s = feature.get('usage');
  if (!usageCache[s]) {
    console.log('Missing: ',s)
  } else {
    return usageCache[s];
  }
}

export default getStyle
export { getUsageStyle }
export { couverture }
export { usage }
