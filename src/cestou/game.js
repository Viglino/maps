import { getExtent, getCenter, getDistance } from './utils.js'
import { toKMString, getNearest, getDMS, getHMS, createElement } from './utils.js';
import getMapAPI from './map.js';

import "./cestou.css"

// Info dialog
const dlog = document.querySelector('dialog.intro')
dlog.showModal();
dlog.querySelector('button').addEventListener('click', e => {
  dlog.close();
  doGame();
})

let layers = [];
let currentFeature = null;

/*
  if (!game.debug) {
    game.mapAPI2.setCenter({ extent: [-4.8, 41.15, 9.8, 51.23] })
  }
*/
class Game {
  constructor() {
    this.running = false;
    this.startDate = Date.now();
    this.endDate = null;
    this.time = 0;  
    this.totalTime = 0;
    //
    this.debug = /debug/.test(location.hash)
    // 
    this.timerDiv = document.querySelector('main .timer');
    getMapAPI(this)
  }
  ready() {
    console.log('Game ready');
    document.body.dataset.game = 'ready';
  }
  start() {
    this.running = true;
    this.startDate = Date.now();
    setTimeout(() => {
      this.showTime()
      this.startDate = Date.now();
      this.endDate = this.startDate;
    }, 4000)
  }
  stop() {
    this.running = false;
    this.endDate = Date.now();
    this.time = this.endDate - this.startDate;
    this.totalTime += this.time;
  }
  showTime() {
    if (this.running) {
      this.endDate = Date.now()
      setTimeout(() => this.showTime(), 1000)
    }
    this.timerDiv.innerHTML = getHMS(this.endDate - this.startDate);
  }
}

const game = new Game()

const resultDiv = document.querySelector('.result')

/** Start a new game
 */
function doGame() {
  delete document.body.dataset.game;
  resultDiv.innerHTML = '';
  
  game.mapAPI2.addLayerFeatures({ id: 2, features: [], clear: true });
  game.mapAPI2.popup();
  layers.forEach(layer => {
    game.mapAPI2.setLayer({ id: layer.id, visible: layer.id < 4 });
  });

  // end
  if (!game.features.length) {
    return
  }

  // Get a feature
  let r = Math.trunc(Math.random() * game.features.length)
  if (game.debug) {
    r = getNearest(game.startPosition, game.features)
  }
  currentFeature = game.features[r];
  game.features.splice(r, 1);

  // Start
  game.start()
  
  // Clue
  document.querySelectorAll('.indice button').forEach((b, i) => {
    const indice = (currentFeature.properties['Indice ' + (i+1)] || 'none').split(':')
    const what = indice[0]
    b.className = what;
    b.dataset.info = '';
    b.dataset.img = false;
    b.dataset.type = what;
    switch(what) {
      case 'none': {
        break;
      }
      case 'zoom':
      case 'dezoom':
      case 'layer':
      case 'img': {
        indice.shift();
        b.dataset.info = indice.join(':')
        break;
      }
      default: {
        b.dataset.info = indice.join(':');
        break;
      }
    }
  })
  // Show
  document.getElementById('map1').style.filter = currentFeature.properties.filter
  layers.forEach(layer => {
    game.mapAPI2.setLayer({ id: layer.id, visible: false });
  });
  game.mapAPI2.setLayer({ id: currentFeature.properties.layer, visible: true });
  game.mapAPI2.setCenter({ extent: getExtent(currentFeature.geometry) }, () => {
    game.mapAPI2.getZoom(z => currentFeature.zoom = z)
  });
  showCurrent()
}

/** Show current position (with rotation) */
function showCurrent(ori) {
  document.querySelector('main aside h1').innerText = currentFeature.properties.Titre || ''
  game.mapAPI2.getCenter(center => {
    game.mapAPI2.moveTo({
      destination: center, 
      rotation: parseInt(ori || currentFeature.properties.orientation || 0) * Math.PI / 180
    })
    setTimeout(() => {
      document.body.dataset.game = 'searching';
    }, 2000)
  })
}

/** Check user position
 */
function checkSolution() {
  game.stop();
  const time = game.time;
  const timeStr = getHMS(time, true);
  const info = currentFeature.properties['Réponse'].split('\n')
  info.forEach((t, i) => {
    if (/^#/.test(t)) {
      info[i] = '<h2>' + t.replace(/^#/, '').trim() +'</h2>';
    } else {
      info[i] = '<p>' + t.trim() + '</p>';
    }
  })
  const infoDiv = createElement('DIV', {
    className: 'info',
    html: info.join('\n'),
    parent: resultDiv
  })
  if (currentFeature.properties.img) {
    createElement('IMG', {
      src: currentFeature.properties.img,
      className: 'img',
      parent: infoDiv      
    })
    createElement('P', {
      html: currentFeature.properties.copyimg || '',  
      className: 'copy',
      parent: infoDiv
    })
  }
  const resultDist = createElement('DIV', {
    className: 'dist',
    parent: resultDiv
  })
  document.body.dataset.game = 'finish'
  game.mapAPI2.setLayer({ id: currentFeature.properties.layer, visible: true })
  game.mapAPI2.getCenter(c => {
    const curPt = getCenter(currentFeature.geometry);
    const dist = getDistance(c, curPt);
    game.mapAPI2.addLayerFeatures({
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
    game.mapAPI2.popup({ position: curPt, content: 'c\'est ici !' });
    const zoom = Math.min(19-Math.log(dist/1000), currentFeature.zoom, 18)
    game.mapAPI2.moveTo({ destination: curPt, zoom: zoom, type: 'flyto' });
    // Result
    let step = 0;
    let s = 33;
    // Show result dist
    function show() {
      s += 33
      step += s;
      if (step > dist) {
        resultDist.innerHTML = toKMString(dist, 0) + ' - ' + timeStr;
        return;
      }
      resultDist.innerHTML = toKMString(step, 0) + ' - ' + timeStr;
      setTimeout(show, 20)
    }
    show()
  })
}

/* Listeners */
document.querySelector('main section button.check').addEventListener('click', checkSolution);
document.querySelector('main section button.next').addEventListener('click', doGame);
document.querySelector('main section button.coords').addEventListener('click', () => {
  document.body.dataset.coords = document.body.dataset.coords === 'false';
});

/* Show clue */
const dlgIndice = document.querySelector('dialog.indice')
dlgIndice.querySelector('button').addEventListener('click', () => {
  dlgIndice.close();
})
document.querySelectorAll('div.indice button').forEach(b => {
  b.addEventListener('click', () => {
    console.log(currentFeature)
    const div = dlgIndice.querySelector('div')
    div.innerHTML = '';
    console.log(b.dataset)
    switch (b.dataset.type) {
      case 'img': {
        createElement('IMG', {
          src: currentFeature.properties.img,
          parent: div
        })
        createElement('P', {
          html: currentFeature.properties.copyimg,
          className: 'img',
          parent: div
        })
        break;
      }
      case 'zoom':
      case 'dezoom': {
        const bt = createElement('BUTTON', {
          html: 'Changer de zoom',
          parent: div
        })
        bt.addEventListener('click', () => {
          game.mapAPI2.getZoom(z => {
            console.log(z, currentFeature.zoom)
            const center = getCenter(currentFeature.geometry);
            if (z < currentFeature.zoom -0.5) {
              game.mapAPI2.moveTo({ destination: center, zoom: currentFeature.zoom, type: 'moveTo' })
            } else {
              game.mapAPI2.moveTo({ destination: center, zoom: currentFeature.zoom -2, type: 'moveTo' })
            }
          })
          dlgIndice.close()
        })
        break;
      }
      case 'layer': {
        let layer = {}
        layers.forEach(l => {
          if (l.id == currentFeature.properties.layer) {
            layer = l
          }
        })
        const a = createElement('A', {
          html: 'Afficher la couche : ' + layer.title,
          href: '#',
          parent: div
        })
        a.addEventListener('click', e => {
          game.mapAPI2.setLayer({ id: layer.id, visible: true })
          e.preventDefault();
          e.stopPropagation();
          dlgIndice.close();
        })
        break;
      }
      default: {
        createElement('P', {
          html: '💡 ' + b.dataset.info,
          parent: div
        })
        break;
      }      
    }
    dlgIndice.showModal()
  })
})

/* debug */
window.doGame = doGame
window.showCurrent = showCurrent

export default game;