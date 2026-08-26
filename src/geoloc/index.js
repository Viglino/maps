import { getDistance, toKMString } from './utils.js'
import "./index.css"

let mapAPI;
const game = {};

MapIFrameAPI.ready('map', function(api) {
  window.mapAPI = mapAPI = api;
  mapAPI.setLayer({ id: 2, displayInLayerSwitcher: false, visible: false });
  mapAPI.setLayer({ id: 1, visible: true });
  mapAPI.setCenter([6.937, 48.297]);
  mapAPI.setZoom(12);
  mapAPI.on('move', e => {
    console.log(e)
    if (e.zoom > 15) {
      document.body.dataset.validate = 'true';
    } else {
      delete document.body.dataset.validate;
    }
  });
  mapAPI.getFeatures({ layerId: 2 }, features => {
    game.features = features;
    // ready
    getImage();
  });
});


document.querySelector('main aside button.ortho').addEventListener('click', e => {
  mapAPI.setLayer({ id: 4, visible: true });
})
document.querySelector('main aside button.map').addEventListener('click', e => {
  mapAPI.setLayer({ id: 4, visible: false });
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


const zoomDiv = document.querySelector('.zoom');
const img = document.querySelector('aside img');

function zoom(b) {
  let zoom = Number(document.body.dataset.img) || 0;
  if (zoom === 0) {
    zoom = document.querySelector(".zoom").clientWidth;
  }
  zoom += b * 200;
  if (img.naturalHeight < img.naturalWidth) {
    zoom = Math.max(zoom, document.querySelector(".zoom").clientWidth * img.naturalHeight / img.naturalWidth);
    zoomDiv.style.backgroundSize = `auto ${zoom}px`;
  } else {
    zoom = Math.max(zoom, document.querySelector(".zoom").clientWidth * img.naturalWidth / img.naturalHeight);
    zoomDiv.style.backgroundSize = `${zoom}px auto`;
  }
  document.body.dataset.img = zoom;
};
zoomDiv.querySelector('.in').addEventListener('click', e => zoom(+1));
zoomDiv.querySelector('.out').addEventListener('click', e => zoom(-1));
zoomDiv.addEventListener('wheel', e => zoom(e.deltaY > 0 ? -1 : +1));

document.querySelector('.backdrop').addEventListener('click', e => {
  if (!document.body.dataset.img) return;
  if (e.target.tagName === 'BUTTON') return;
  delete document.body.dataset.img
  zoomDiv.style.backgroundSize = 'cover';
});
document.querySelector('.zoom .close').addEventListener('click', e => {
  delete document.body.dataset.img
  zoomDiv.style.backgroundSize = 'cover';
});

img.addEventListener('load', e => {
  document.body.dataset.img = 'loaded';
  setTimeout(() => zoom(0), 500);
});
img.addEventListener('click', e => {
  document.body.dataset.img = '';
  setTimeout(() => zoom(0), 500);
});


dlog.querySelector('button').addEventListener('click', e => {
  const id = dlog.querySelector('input').value;
  showImage(id);
})

function getImage() {
  if (/debug/.test(document.location.hash)) {
    const id = game.features[0].properties.id;
    dlog.querySelector('input').value = id;
  } 
  dlog.showModal();
}

function showImage(id) {
  dlog.close();
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
  document.body.querySelector('.zoom').style.backgroundImage = "url(https://macarte.ign.fr/api/image/" + game.feature.properties.img + ")";
}