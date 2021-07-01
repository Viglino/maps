import { Map, View } from 'ol'
import Geoportail from 'ol-ext/layer/Geoportail'
import Search from 'ol-ext/control/SearchBAN'
import Permalink from 'ol-ext/control/Permalink'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'
import Select from 'ol/interaction/Select'
import CanvasFilter from 'ol-ext/filter/CanvasFilter'

/** Get a new map
 * @param {Element|string} target 
 * @param {bool} use a permalink 
 */
function getMap(target, perma) {

  // Layers
  const layers = [
    new Geoportail({
      layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
      visible: false
    }),
    new Geoportail({
      layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', 
      visible: true
    })
  ]
  // Grayscale
  var filter = new CanvasFilter({ grayscale: 100 });
  layers[0].addFilter(filter);
  layers[1].addFilter(filter);

  const map = new Map ({
    target: target,
    view: new View ({
      zoom: 14,
      center: [-130682, 5566802]
    }),
    layers: layers
  });

  map.addControl(new LayerSwitcher());
  if (perma) {
    map.addControl(new Search({ centerOnSelect: true }));
    const plink = new Permalink({ visible: false });
    map.addControl(plink);
  }

  // Selection
  const sel = new Select();
  map.addInteraction(sel);
  sel.on('select', (e) => {
    const f = e.selected[0];
    if (f) console.log(f.getProperties());
  });

  return map;
}

export default getMap;
