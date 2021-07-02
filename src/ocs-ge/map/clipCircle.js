import ImageCanvas from 'ol/source/ImageCanvas'
import Layer from 'ol/layer/Image'
import Clip from 'ol-ext/interaction/Clip'
import {buffer} from 'ol/extent';
import {boundingExtent} from 'ol/extent';
import Circle from 'ol/geom/Circle';
import 'ol-ext/geom/GeomUtils';

let radius = 150;
document.querySelector('.clip input[type="range"]').value = radius;

function clip(map) {
  const canvas = document.createElement('CANVAS');
  const source = new ImageCanvas({
    canvasFunction: function(extent, res, ratio, size) {
      canvas.width = size[0];
      canvas.height = size[1];
      canvas.getContext('2d').fillStyle = 'rgba(0,0,0,.2)';
      canvas.getContext('2d').fillRect(0, 0, size[0], size[1]);
      return canvas;
    }
  });
  const layer = new Layer({
    displayInLayerSwitcher: false,
    source: source
  })
  map.addLayer(layer);
  const clip = new Clip({
    radius: radius, 
    layers: layer
  });
  map.addInteraction(clip);
  return { clip: clip, layer: layer };
}

/** Handle clip position */
function clipCircle(map1, map2) {
  const clip1 = clip(map1);
  const clip2 = clip(map2);
  map1.on('pointermove', (e) => {
    clip2.clip.setPixelPosition(e.pixel);
    if (clip1.layer.getVisible()) {
      map1.dispatchEvent('clip');
      map2.dispatchEvent('clip');
    }
  });
  map2.on('pointermove', (e) => {
    clip1.clip.setPixelPosition(e.pixel);
    if (clip1.layer.getVisible()) {
      map1.dispatchEvent('clip');
      map2.dispatchEvent('clip');
    }
  });
  const circle = new Circle([0,0], 0);
  const clipping = {
    setActive: (b) => {
      clip1.layer.setVisible(b);
      clip2.layer.setVisible(b);
    },
    isActive: () => {
      return clip1.layer.getVisible();
    },
    getExtent: () => {
      const ext = boundingExtent([clip1.clip.getPosition()]);
      return buffer(ext, radius * map.getView().getResolution());
    },
    getCircle: () => {
      circle.setCenter(clip1.clip.getPosition());
      circle.setRadius(radius * map.getView().getResolution());
      return circle;
    },
    getPosition: () => {
      return clip1.clip.getPosition();
    },
    getRadius: () => {
      return radius * map.getView().getResolution()
    }
  }

  const check = document.querySelector('.clip input[type="checkbox"]')
  check.addEventListener('change', () => {
    clipping.setActive(check.checked);
    map1.dispatchEvent('clip');
    map2.dispatchEvent('clip');
  })
  const range = document.querySelector('.clip input[type="range"]');
  range.addEventListener('change', () => {
    radius = parseInt(range.value);
    clip1.clip.setRadius(radius);
    clip2.clip.setRadius(radius);
  })

  return clipping;
}

export default clipCircle
