import Hover from 'ol-ext/interaction/Hover'
import Tooltip from 'ol-ext/overlay/Tooltip'
import {couverture} from '../style'

export default function(map, layers) {
  const hover = new Hover({ 
    layers: layers,
    cursor: 'pointer'
  });
  map.addInteraction(hover);
  const tip = new Tooltip({ offsetBox: [5, 0] });
  map.addOverlay(tip);
  hover.on('enter', (e) => {
    const cov = e.feature.get('couverture');
    if (cov) tip.setInfo(couverture[cov].name);
    else tip.setInfo();
  });
  hover.on('leave', (e) => {
    tip.setInfo();
  });
  map.getTargetElement().addEventListener('mouseleave', () => {
    tip.setInfo();
  });
  return hover;
}