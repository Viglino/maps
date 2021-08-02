import Select from 'ol/interaction/Select'

function onSelect(sel, stat, sel2, layer2) {
  console.log('sel')
  sel.on('select', e => {
    console.log(e)
    const f = e.selected[0];
    const insee = f.get('insee_com');
    sel2.getFeatures().clear();
    if (f) {
      stat.show(f.get('flux'));
      layer2.getSource().getFeatures().forEach(f2 => {
        if (f2.get('insee_com') === insee) {
          sel2.getFeatures().push(f2);
        }
      });
    }
  })
};

export default function(map1, communes1, map2, communes2, stat) {
  const sel1 = new Select({ layers: [ communes1 ] });
  map1.addInteraction(sel1);
  const sel2 = new Select({ layers: [ communes2 ] });
  map2.addInteraction(sel2);

  onSelect(sel1, stat, sel2, communes2)
  onSelect(sel2, stat, sel1, communes1)
}
