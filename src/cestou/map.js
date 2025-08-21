import { getDMS } from './utils.js';


function getMapAPI(game) {
  // Load MapIFrameAPI
  MapIFrameAPI.ready('map1', function(api) {
    const mapAPI1 = api;
    game.mapAPI1 = mapAPI1;
    mapAPI1.getCenter(c => game.startPosition = c)
    // Hide layers
    mapAPI1.getLayers(l => {
      game.layers = l;
      // Hide all layers
      l.forEach(layer => {
        mapAPI1.setLayer({ id: layer.id, visible: layer.id === 3 });
      });
      // hide controls
      ['zoom', 'mousePosition', 'layerSwitcher', 'profil', 'printDlg', 'legend', 'searchBar', 'permalink', 'locate'].forEach(id => {
        mapAPI1.mapControl({ id, visible: false });
      });
    })
    // Get features
    mapAPI1.getFeatures({ layerId: 18 }, features => {
      game.features = features;
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
    // ready
    if (game.mapAPI2) {
      game.ready();
    }
  })

  // Load MapIFrameAPI
  MapIFrameAPI.ready('map2', function(api) {
    const mapAPI2 = api;
    game.mapAPI2 = mapAPI2;
    // Hide game layers
    [2,14,18].forEach(l => {
      mapAPI2.setLayer({ id: l, displayInLayerSwitcher: false, visible: false });
    })
    // Clear features
    mapAPI2.addLayerFeatures({ id: 2, features: [], clear: true });
    // Hide layers
    mapAPI2.getLayers(l => {
      getMapAPI.layers = l;
      // Hide layers ?
      l.forEach(layer => {
        mapAPI2.setLayer({ id: layer.id, visible: layer.id < 4 });
      });
    })
    if (!game.debug) {
      mapAPI2.setCenter({ extent: [-4.8, 41.15, 9.8, 51.23] })
    }
    mapAPI2.on('move', c => {
      document.querySelector('section .coords').innerHTML = getDMS(c.center)
    })
    mapAPI2.layout({ css: `
      .ol-control.ol-search {
        left: 14em;
      }
      .ol-control.ol-rotate,
      .ol-control.ol-layer-shop {
        right: 13em;
      }
      .ol-control.ol-attribution {
        bottom: 4em;
        right: 13em;
      }
      .ol-scale-line {
        bottom: 4.5em;
        right: auto;
        left: 1em
      }
      map .ol-control.ol-permalink {
        display: none;
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
    // ready
    if (game.mapAPI1) {
      game.ready();
    }
  })
}

export default getMapAPI;