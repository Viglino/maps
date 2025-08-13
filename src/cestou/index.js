import { getExtent, getCenter, getDistance } from './utils.js'
import { toKMString, getNearest, getDMS, getHMS } from './utils.js';

import "./cestou.css"


let mapAPI1, mapAPI2;
let layers = [];
let gameFeatures = [];
let currentFeature = null;
let startPosition = [0,0];
let game = {
  start: Date.now(),
  end: null,
  running: false
};

const resultDiv = document.querySelector('.result')
const debug = /debug/.test(location.hash)

// Load MapIFrameAPI
MapIFrameAPI.ready('map1', function(api) {
  mapAPI1 = api;
  window.mapAPI1 = mapAPI1;
  mapAPI1.getCenter(c => startPosition = c)
  // Hide layers
  mapAPI1.getLayers(l => {
    layers = l;
    // Hide all layers
    l.forEach(layer => {
      mapAPI1.setLayer({ id: layer.id, visible: false });
    });
    // hide controls
    ['zoom', 'mousePosition', 'layerSwitcher', 'profil', 'printDlg', 'legend', 'searchBar', 'permalink', 'locate'].forEach(id => {
      mapAPI1.mapControl({ id, visible: false });
    });
  })
  // Get features
  mapAPI1.getFeatures({ layerId: 18 }, features => {
    gameFeatures = features;
    doGame();
  });
  // Style
  mapAPI1.layout({ css: `
    .map .ol-control.ol-permalink {
      display: none;
    }
    .map .ol-scale-line {
      left: 1em;
      right: unset;
    }
  `})

})

// Load MapIFrameAPI
MapIFrameAPI.ready('map2', function(api) {
  mapAPI2 = api;
  window.mapAPI2 = mapAPI2;
  [2,14,18].forEach(l => {
    mapAPI2.setLayer({ id: l, displayInLayerSwitcher: false, visible: false });
  })
  mapAPI2.addLayerFeatures({ id: 2, features: [], clear: true });
    mapAPI2.getLayers(l => {
    layers = l;
    // Hide layers ?
    l.forEach(layer => {
      mapAPI2.setLayer({ id: layer.id, visible: layer.id < 4 });
    });
  })
  mapAPI2.on('move', c => {
    document.querySelector('section .coords').innerHTML = getDMS(c.center)
  })
  mapAPI2.layout({ css: `
    .ol-control.ol-search {
        left: 300px;
    }
    .ol-overlaycontainer-stopevent:before,
    .ol-overlaycontainer-stopevent:after {
      content: '';
      position: absolute;
      top: calc(50% - 5px);
      left: 0%;
      width: 100%;
      height: 10px;
      pointer-events: none;
      background-image: linear-gradient(90deg, #000 2px, transparent 2px), 
        linear-gradient(0deg, transparent 29px, #000 29px, #000 31px, transparent 31px);
      background-size: 60px 60px;
      background-position: center;
    }
    .ol-overlaycontainer-stopevent:after {
      top: 0%;
      left: calc(50% - 5px);
      width: 10px;
      height: 100%;
      background-image: linear-gradient(0deg, #000 2px, transparent 2px), 
        linear-gradient(90deg, transparent 29px, #000 29px, #000 31px, transparent 31px);
    }
    `
  });

})

/** Start a new game
 */
function doGame() {
  delete document.body.dataset.game;
  
  if (mapAPI2) {
    mapAPI2.addLayerFeatures({ id: 2, features: [], clear: true });
    mapAPI2.popup();
  }

  // end
  if (!gameFeatures.length) {
    return
  }

  // Get a feature
  let r = Math.trunc(Math.random() * gameFeatures.length)
  if (debug) {
    r = getNearest(startPosition, gameFeatures)
  }
  currentFeature = gameFeatures[r];
  gameFeatures.splice(r, 1);

  // Start
  game.running = true;
  setTimeout(() => {
    showTime()
    game.start = Date.now();
  }, 5000)

  // Show
  document.getElementById('map1').style.filter = currentFeature.properties.filter
  layers.forEach(layer => {
    mapAPI1.setLayer({ id: layer.id, visible: false });
  });
  mapAPI1.setLayer({ id: currentFeature.properties.layer, visible: true });
  mapAPI1.setCenter({ extent: getExtent(currentFeature.geometry) });
  showCurrent()
}

/** Show current position (with rotation) */
function showCurrent(ori) {
  document.querySelector('main aside h1').innerText = currentFeature.properties.Titre || ''
  mapAPI1.getCenter(center => {
    mapAPI1.moveTo({
      destination: center, 
      rotation: parseInt(ori || currentFeature.properties.orientation || 0) * Math.PI / 180
    })
    setTimeout(() => {
      document.body.dataset.game = '';
    }, 5000)
  })
}

/** Check user position
 */
function checkSolution() {
  mapAPI2.getCenter(c => {
    const curPt = getCenter(currentFeature.geometry);
    const dist = getDistance(c, curPt);
    mapAPI2.addLayerFeatures({
      id: 2,
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [c, curPt]
        },
        properties: {
          distance: toKMString(dist),
        }
      }],
      clear: true
    });
    mapAPI2.popup({ position: curPt, content: 'c\'est ici !' });
    // Result
    let step = 0;
    let s = 33
    // Show result dist
    function show() {
      s += 33
      step += s;
      if (step > dist) {
        resultDiv.innerHTML = dist.toLocaleString() + ' m';
        return;
      }
      resultDiv.innerHTML = step.toLocaleString() + ' m';
      setTimeout(show, 20)
    }
    show()
  })
}


const timer = document.querySelector('aside .timer')
function showTime() {
  game.end = Date.now()
  timer.innerHTML = getHMS(game.end - game.start);
  if (game.running) {
    setTimeout(showTime, 1000)
  }
}

/* Listeners */
document.querySelector('main section button').addEventListener('click', checkSolution);


/* debug */
window.doGame = doGame
window.showCurrent = showCurrent