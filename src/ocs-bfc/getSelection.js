import Select from 'ol/interaction/Select'
import { click } from 'ol/events/condition'

function onSelect(sel, layer1, stat1, sel2, layer2, stat2) {
  sel.on('select', e => {
    const f = e.selected[0];
    if (f) {
      const insee = f.get('insee_com');
      console.log(insee, f.get('nom_com'));
      const cs = f.getProperties();
      const stats = {};
      for (let c in cs) {
        if (/^CS/.test(c) /* && cs[c] */) {
          stats[c] = cs[c];
        }
      }
      stat1.show(stats);
      layer2.getSource().getFeatures().forEach(f2 => {
        if (f2.get('insee_com') === insee) {
          sel2.getFeatures().clear();
          sel2.getFeatures().push(f2);
          const cs = f2.getProperties();
          const stats = {};
          for (let c in cs) {
            if (/^CS/.test(c) /* && cs[c] */) {
              stats[c] = cs[c];
            }
          }
          stat2.show(stats);
        }
      });
    }
  })
};

function getSelection(map1, layer1, stat1, map2, layer2, stat2) {
  const sel1 = new Select({ layers: [layer1], condition: click });
  map1.addInteraction(sel1);
  const sel2 = new Select({ layers: [layer2], condition: click });
  map2.addInteraction(sel2);

  onSelect(sel1, layer1, stat1, sel2, layer2, stat2);
  onSelect(sel2, layer2, stat2, sel1, layer1, stat1);
};

export default getSelection
