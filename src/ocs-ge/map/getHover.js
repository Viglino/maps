import Hover from 'ol-ext/interaction/Hover'
import Tooltip from 'ol-ext/overlay/Tooltip'
import {couverture} from '../style'

export default function(map) {
  const hover = new Hover({ cursor: 'pointer' });
  map.addInteraction(hover);
  const tip = new Tooltip({ offsetBox: [5, 0] });
  map.addOverlay(tip);
  hover.on('enter', (e) => {
    tip.setInfo(couverture[e.feature.get('couverture')].name);
  })
  map.getTargetElement().addEventListener('mouseleave', () => {
    tip.setInfo();
  })
  return hover;
}