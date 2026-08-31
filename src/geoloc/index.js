import { getDistance, toKMString } from './utils.js'
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import Projection from 'ol/proj/Projection.js'
import GeoImageLayer from 'ol-ext/layer/GeoImage.js'
import GeoImageSource from 'ol-ext/source/GeoImage.js'

import 'ol/ol.css'
import "./index.css"

let mapAPI;
const game = window.game = {};

MapIFrameAPI.ready('map', function(api) {
  window.mapAPI = mapAPI = api;
  mapAPI.setLayer({ id: 2, displayInLayerSwitcher: false, visible: false });
  mapAPI.setLayer({ id: 1, visible: true });
  mapAPI.setCenter([6.937, 48.297]);
  mapAPI.setZoom(12);
  mapAPI.on('move', e => {
    if (e.zoom > 15) {
      document.body.dataset.validate = 'true';
    } else {
      delete document.body.dataset.validate;
    }
  });
  mapAPI.getFeatures({ layerId: 2 }, features => {
    features = features.filter(f => f.properties && f.properties.id);
    features.sort((a, b) => (a.properties.nb || 999) - (b.properties.nb || 999));
    game.features = features;
    game.max = features.length;
    // ready
    getImage();
  });
});

/* Layerswitcher */
document.querySelector('main aside button.ortho').addEventListener('click', e => {
  mapAPI.setLayer({ id: 1, visible: false });
  mapAPI.setLayer({ id: 4, visible: true });
  mapAPI.setLayer({ id: 8, visible: false });
  mapAPI.setLayer({ id: 9, visible: false });
  mapAPI.setLayer({ id: 10, visible: false });
  mapAPI.setLayer({ id: 12, visible: false });
})
document.querySelector('main aside button.map').addEventListener('click', e => {
  mapAPI.setLayer({ id: 1, visible: true, opacity: 1 });
  mapAPI.setLayer({ id: 4, visible: false });
  mapAPI.setLayer({ id: 8, visible: false });
  mapAPI.setLayer({ id: 9, visible: false });
  mapAPI.setLayer({ id: 10, visible: false });
  mapAPI.setLayer({ id: 12, visible: false });
})
document.querySelector('main aside button.reseau').addEventListener('click', e => {
  mapAPI.setLayer({ id: 1, visible: true, opacity: 0.3 }, console.log);
  mapAPI.setLayer({ id: 4, visible: false });
  mapAPI.setLayer({ id: 8, visible: true });
  mapAPI.setLayer({ id: 9, visible: true });
  mapAPI.setLayer({ id: 10, visible: false });
  mapAPI.setLayer({ id: 12, visible: false });
})
document.querySelector('main aside button.lidar').addEventListener('click', e => {
  mapAPI.setLayer({ id: 1, visible: true, opacity: 0.3 }, console.log);
  mapAPI.setLayer({ id: 4, visible: false });
  mapAPI.setLayer({ id: 8, visible: false });
  mapAPI.setLayer({ id: 9, visible: false });
  mapAPI.setLayer({ id: 10, visible: true });
  mapAPI.setLayer({ id: 12, visible: true });
})


document.querySelector('.validate button').addEventListener('click', e => {
  mapAPI.getCenter(pos => {
    if (game.feature) {
      const dist = getDistance(pos, game.feature.geometry.coordinates);
      if (dist < 1000) {
        ddist.dataset.win = '';
      } else {
        delete ddist.dataset.win;
      }
      ddist.dataset.dist = dist;
      ddist.querySelector('span').textContent = toKMString(dist);
      ddist.showModal();
    };
  });
});

const dlog = document.body.querySelector('dialog.start');
const ddist = document.body.querySelector('dialog.dist');
ddist.querySelector('button.again').addEventListener('click', e => {
  ddist.close();
})
ddist.querySelector('button.win').addEventListener('click', e => {
  ddist.close();
  getImage();
})
dlog.querySelector('.next').addEventListener('click', e => {
  game.features.shift();
  getImage();
});

const zoomDiv = document.querySelector('.zoom');
const img = document.querySelector('aside img');

const pixelProjection = new Projection({
  code: 'pixel',
  units: 'pixels',
  extent: [-100000, -100000, 100000, 100000]
});
const zoomMap = new Map({
  target: zoomDiv,
  view: new View({
    projection: pixelProjection,
    center: [0, 0],
    zoom: 2
  })
});
console.log(zoomMap);

function zoom(b) {
  zoomMap.updateSize();
  if (!b) {
    const imgLayer = zoomMap.getLayers().item(0);
    const ext = imgLayer.getSource().getExtent();
    const p0 = Math.max(ext[0], ext[1]);
    const p1 = Math.min(ext[2], ext[3]);
    zoomMap.getView().fit([p0,p0,p1,p1])
    setTimeout(() => {
      zoomMap.updateSize();
    }, 100);
  } else {
    zoomMap.getView().setZoom(zoomMap.getView().getZoom() + b * 0.5);
  }

};
zoomDiv.querySelector('.in').addEventListener('click', e => zoom(+1));
zoomDiv.querySelector('.out').addEventListener('click', e => zoom(-1));

document.querySelector('.backdrop').addEventListener('click', e => {
  if (!document.body.dataset.img) return;
  if (e.target.tagName === 'BUTTON') return;
  delete document.body.dataset.img
  delete document.body.dataset.ready
});
document.querySelector('.zoom .close').addEventListener('click', e => {
  delete document.body.dataset.img
  delete document.body.dataset.ready
});


/* Open image in zoom */
img.addEventListener('load', e => {
  document.body.dataset.img = 'loaded';
  setTimeout(() => {
    zoom(0)
  }, 500);
});
img.addEventListener('click', e => {
  // zoom(0);
  setTimeout(() => {
    document.body.dataset.img = 'ok';
  }, 10);
  setTimeout(() => {
    document.body.dataset.ready = '';
    zoom(0)
  }, 500);
});


dlog.querySelector('button').addEventListener('click', e => {
  const id = dlog.querySelector('input').value;
  showImage(id);
})

function getImage() {
  if (!game.features.length) {
    dlog.querySelector('input').value = 'FIN 🎉';
    dlog.querySelector('p').innerHTML = 'Bravo, vous avez fini !';
    return;
  } else if (/debug/.test(document.location.hash)) {
    const id = game.features[0].properties.id;
    dlog.querySelector('input').value = id;
    document.body.dataset.debug = 'debug';
  } 
  dlog.querySelector('p').innerHTML = '<strong>' + game.features.length + '</strong> paysages<br/>à trouver sur <strong>' + game.max + '</strong>';
  dlog.showModal();
  setTimeout(() => {
    dlog.querySelector('input').focus();
  }, 100);
}

function showImage(id) {
  if (!game.features.length) return;
  // Go!
  dlog.close();
  document.querySelector('header div').innerHTML = id;
  // Recherche image
  game.feature = game.features.find((f, i) => {
    if (f.properties.id == id) {
      game.features.splice(i, 1);
      return true;
    }
  });
  // console.log(game.feature);
  if (!game.feature) {
    getImage();
    return;
  }
  document.querySelector('aside img').src = "https://macarte.ign.fr/api/image/" + game.feature.properties.img;
  const imgLayer = new GeoImageLayer({
    source: new GeoImageSource({
      url: "https://macarte.ign.fr/api/image/" + game.feature.properties.img,
      imageCenter: [0,0],
      imageScale: [1,1],
      projection: pixelProjection
    })
  });
  const oldLayer = zoomMap.getLayers().item(0);
  if (oldLayer) {
    zoomMap.removeLayer(oldLayer);
  }
  zoomMap.addLayer(imgLayer);
  imgLayer.getSource().getGeoImage().addEventListener('load', () => {
    zoom(0);
  })
}