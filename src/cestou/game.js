import { getExtent, getCenter, getDistance } from './utils.js'
import { toKMString, getNearest, getDMS, getHMS, createElement } from './utils.js';
import getMapAPI from './map.js';

import "./cestou.css"

// Intro dialog
const dlog = document.querySelector('dialog.intro')
dlog.showModal();
dlog.querySelector('button').addEventListener('click', e => {
  dlog.close();
  doGame();
})
// Info dialog
const dinfo = document.querySelector('dialog.info')
dinfo.querySelector('button').addEventListener('click', e => {
  dinfo.close();
})
document.querySelector('main section button.info').addEventListener('click', e => {
  const pt = getCenter(game.currentFeature.geometry)
  dinfo.querySelector('.question').href = location.origin + location.pathname +'?lonlat=' + pt[0].toFixed(5) + ',' + pt[1].toFixed(5);
  dinfo.showModal();
})

// Current feature
let currentFeature = null;

class Game {
  constructor() {
    this.running = false;
    this.startDate = Date.now();
    this.endDate = null;
    this.time = 0;  
    this.count = 0;
    this.totalTime = 0;
    this.totalDist = 0;
    //
    this.debug = /debug/.test(location.hash)
    //
    this.lonlat = location.search.replace(/^\?lonlat=([0-9.]*),([0-9.]*).*/, '$1,$2').split(',').map(parseFloat)
    // 
    this.timerDiv = document.querySelector('main .timer');
    getMapAPI(this)
  }
  ready() {
    console.log('Game ready');
    document.body.dataset.game = 'ready';
    if (!this.debug) {
      this.mapAPI2.setCenter({ extent: [-4.8, 41.15, 9.8, 51.23] })
    }
    if (this.lonlat[0] && this.lonlat[1]) {
      this.startPosition = this.lonlat;
      this.debug = true;
    }
    dinfo.querySelector('.total').innerText = this.features.length;
    dlog.querySelector('b').innerText = this.features.length;
    this.setDistance(0);
  }
  start() {
    this.running = true;
    this.startDate = Date.now();
    this.count++;
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
  setDistance(d) {
    this.totalDist += d;
    dinfo.querySelector('.found').innerText = this.count;
    dinfo.querySelector('.time').innerText = getHMS(this.totalTime);
    dinfo.querySelector('.dist').innerText = toKMString(this.totalDist);
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
  game.layers.forEach(layer => {
    game.mapAPI2.setLayer({ id: layer.id, visible: layer.id < 4 });
  });

  // end
  if (!game.features.length) {
    document.body.querySelector('dialog.final .time').innerText = getHMS(game.totalTime) 
    document.body.querySelector('dialog.final .dist').innerText = toKMString(game.totalDist);

    document.body.querySelector('dialog.final').showModal()
    return
  }

  // Get a feature
  let r = Math.trunc(Math.random() * game.features.length)
  if (game.debug) {
    r = getNearest(game.startPosition, game.features)
  }
  game.currentFeature = currentFeature = game.features[r];
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
  game.layers.forEach(layer => {
    game.mapAPI1.setLayer({ 
      id: layer.id, 
      visible: layer.id == currentFeature.properties.layer 
    });
  });
  game.mapAPI1.setCenter({ extent: getExtent(currentFeature.geometry) }, () => {
    game.mapAPI1.getZoom(z => currentFeature.zoom = z)
  });
  showCurrent()
}

/** Show current position (with rotation) */
function showCurrent(ori) {
  document.querySelector('main aside h1').innerText = currentFeature.properties.Titre || ''
  game.mapAPI1.getCenter(center => {
    game.mapAPI1.moveTo({
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
    game.setDistance(dist);
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
    const div = dlgIndice.querySelector('div')
    div.innerHTML = '';
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
        game.mapAPI1.getZoom(z => {
          if (z > currentFeature.zoom -0.5) {
            const center = getCenter(currentFeature.geometry);
            game.mapAPI1.moveTo({ destination: center, zoom: currentFeature.zoom -2, type: 'moveTo' })
            setTimeout(() => {
              game.mapAPI1.moveTo({ destination: center, zoom: currentFeature.zoom, type: 'moveTo' })
            }, 3000)
          }
        })
        return;
      }
      case 'layer': {
        let layer = {}
        game.layers.forEach(l => {
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