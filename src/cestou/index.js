import { getExtent, getCenter, getDistance } from './utils.js'
import "./cestou.css"
import { toKMString, getNearest } from './utils.js';

let mapAPI1, mapAPI2;
let layers = [];
let gameFeatures = [];
let currentFeature = null;
let startPosition = [0,0];

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
})

// Load MapIFrameAPI
MapIFrameAPI.ready('map2', function(api) {
  mapAPI2 = api;
  window.mapAPI2 = mapAPI2;
  mapAPI2.setLayer({ id: 18, displayInLayerSwitcher: false, visible: false });
  mapAPI2.addLayerFeatures({ id: 2, features: [], clear: true });
    mapAPI2.getLayers(l => {
    layers = l;
    // Hide layers ?
    l.forEach(layer => {
      mapAPI2.setLayer({ id: layer.id, visible: layer.id < 4 });
    });
  })
})


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

  // Show
  layers.forEach(layer => {
    mapAPI1.setLayer({ id: layer.id, visible: false });
  });
  mapAPI1.setLayer({ id: currentFeature.properties.layer, visible: true });
  mapAPI1.setCenter({ extent: getExtent(currentFeature.geometry) });
  mapAPI1.getCenter(center => {
    mapAPI1.moveTo({
      destination: center, 
      rotation: parseInt(currentFeature.properties.orientation || 0) * Math.PI / 180
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

/* Listeners */
document.querySelector('main section button').addEventListener('click', checkSolution);


/* debug */
window.doGame = doGame