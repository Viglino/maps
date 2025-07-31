import './barouf.css';

let mapAPI;
let stats;
let linkDiv = '';

MapIFrameAPI.ready('map', function(api) {
  // Récupération de l'API pour un accès global
  mapAPI = api;
  // Calculer les stats
  initStats()
  // On select
  /*
  mapAPI.on('select', features => {
    console.log('select', features);
    showFeature(features)
  })
  mapAPI.on('select:show', feature => {
    console.log('select:show', feature);
    showFeature([feature])
  })
  */
})


function showFeature(features) {
  const f = features[Math.trunc(Math.random() * features.length)];
  let info = '';
  const sentence = [
    `Le gars il s'appelle Tin,<br/> c'est le bar à Tin`,
    `Le gars il s'appelle Mine,<br/> c'est le bar à Mine`,
    `Le gars il s'appelle Ka,<br/> c'est le bar à Ka`,
    `Le gars il s'appelle Cuda,<br/> c'est le bar à Cuda, ♫ ha!`,
    `Le gars il s'appelle Joe,<br/> c'est le bar'Joe`,
    `Le gars il s'appelle Jo,<br/> c'est le Jo'bar`,
    `Le gars il s'appelle Bichette,<br/> c'est le bar'Bichette`,
    `Le gars il s'appelle Bo,<br/> c'est le Bo'bar`
  ]
  if (f) {
    const url = [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Alex_Knight_2016_%28Unsplash%29.jpg/330px-Alex_Knight_2016_%28Unsplash%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bar-neon-sign-11291208084Hn6.jpg/330px-Bar-neon-sign-11291208084Hn6.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Udagawacho%2C_Shibuya%2C_Japan_%28Unsplash%29.jpg/330px-Udagawacho%2C_Shibuya%2C_Japan_%28Unsplash%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Is_Open.jpg/330px-Is_Open.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Neon_Open_Sign.jpg/330px-Neon_Open_Sign.jpg'
    ]
    info = `<h2>${f.properties.Nom}</h2>`
    + `<img src="${url[Math.trunc(Math.random()*url.length)]}" />`
    + `<p>${f.properties.numeroVoieEtablissement || ''}${f.properties.indiceRepetitionEtablissement || ''} ${f.properties.typeVoieEtablissement || ''} ${f.properties.libelleVoieEtablissement || ''} <br/>`
    + `${f.properties.codePostalEtablissement || ''} ${f.properties.libelleCommuneEtablissement || ''}</p>`
  } else {
    info = `<h2>Jeux de mots</h2>`
    + `<img class="jamel" src="https://macarte.ign.fr/api/image/img_rbt18795" />`
    + `<p>${sentence[Math.trunc(Math.random()*sentence.length)]}</p>`;
  }
  document.querySelector('aside DIV').innerHTML = info;
}

/* Initialize statistics + main links */
function initStats() {
  mapAPI.getFeatures({}, features => {
    stats = {
      features: features.length,
      filtered: 0
    }
    showStats(0)
    // Create main links
    const tab = {}
    const remove = ['CAFE', 'SARL', 'TABAC', 'BISTROT', 'BAR', 'BRASSERIE', 
      'RESTAURANT', 'PUB', 'SNACK', 'PIZZERIA', 'TRAITEUR', 'BISTRO', 'BISTROT', 'EURL', 
      'COMPTOIR', 'COFFEE', 'HOTEL', 'L\'HOTEL', 'BUVETTE', 'RELAIS', 'AUBERGE', 'L\'AUBERGE', 
      'CAVE', 'MAISON', 'PIZZA', 'TAVERNE', 'CLUB', 'DEUX', 'FOYER', 'TABLE', 'CASA', 'COMITE', 
      'ASSOCIATION', 'INDIVISION', 'RESTAURATION', 'FETES', 'PRESSE', 'LOUNGE', 'SOCIETE', 'SASU',
      'AMICALE'];
    features.forEach(feature => {
      feature.properties.Nom.split(/ |-|,/).forEach(word => {
        if (word.length > 3 && remove.indexOf(word) === -1) {
          if (!tab[word]) {
            tab[word] = 0;
          }
          tab[word]++;
        }
      })
      // Spetial cases
      if (/HOTEL DE VILLE/.test(feature.properties.Nom)) {
        tab['HOTEL DE VILLE'] = (tab['HOTEL DE VILLE'] || 0) + 1;
      }
    })
    // Clean up
    tab.VOUS -= tab.RENDEZ
    const cleanup  = {
      'P(E|\')TITE?S?': ['P\'TIT', 'P\'TITS', 'P\'TITE', 'P\'TITES', 'PETIT', 'PETITS', 'PETITE', 'PETITES'],
      'ETOILE': [ 'L\'ETOILE' ],
      'ESCALE': [ 'L\'ESCALE' ],
      'EMBUSCADE': [ 'L\'EMBUSCADE' ],
      'HALLES?': [ 'HALLE', 'HALLES' ],
      'RENDEZ(-| )VOUS': [ 'RENDEZ' ],
      'BOULES?': [ 'BOULE', 'BOULES' ],
      'ATELIER': [ 'L\'ATELIER' ],
      'SAINTE?S?': [ 'SAINT', 'SAINTS', 'SAINTE', 'SAINTES' ],
      'MOULINS?': [ 'MOULIN', 'MOULINS' ],
      'VILLE': [],
      'JEAN BART': [ 'BART' ]
    }
    Object.keys(cleanup).forEach(k => {
      tab[k] = tab[k] || 0;
      cleanup[k].forEach(k2 => {
        tab[k] += (tab[k2] || 0)
        delete tab[k2]
      })
    })
    // Sort links
    const keys = Object.keys(tab).sort((a, b) => {
      return tab[b] - tab[a];
    })
    // Create links
    let links = '';
    for (let i=0; i<100; i++) {
      links += `<a href="#" class="link" data-what="${keys[i]}" data-nb="${tab[keys[i]]}" aria-label="rechercher...">`
        + keys[i].replace(/.\?/g,'').replace(/\((.)[^\)]*\)/g,'$1')
        +`</a> - `;
    }
    linkDiv = document.querySelector('aside .links');
    linkDiv.innerHTML = links;
    linkDiv.querySelectorAll('.link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const what = '\\b' + e.target.dataset.what + '\\b';
        filter('Nom', what);
        document.querySelector('input[type="search"]').value = what;
      })
    })  
    showFeature([])
  })
}

/** Filter
 * @param {string} what
 * @param {*} value
 */
function filter(what, value) {
  const filt = {
    layerId: 4,
    attr: what,
    op: 'regexp',
    val: value,
  }
  // Filter feature
  mapAPI.getFeatures(filt, features => {
    mapAPI.addLayerFeatures({ 
      id: 10, 
      features: features, 
      clear: true
    })
    /*
    if (what === 'Nom') {
      features.forEach(feature => {
        console.log(feature.properties.Nom)
      })
    }
    */
    showStats(features);
  })
}

/* Show statistics / select number */
function showStats(features) {
  const nb = Array.isArray(features) ? features.length : (features || 0);
  stats.filtered = nb || 0;
  if (nb) {
    mapAPI.setLayer({ id: 10, visible: true })
    mapAPI.setLayer({ id: 4, visible: false })
  } else {
    mapAPI.setLayer({ id: 10, visible: false })
    mapAPI.setLayer({ id: 4, visible: true })
  }
  const statsEl = document.querySelector('footer section span.total');
  const selectedEl = document.querySelector('footer section span.selected');
  if (stats) {
    statsEl.textContent = stats.features.toLocaleString();
    selectedEl.textContent = stats.filtered.toLocaleString();
  } else {
    statsEl.textContent = 0;
    selectedEl.textContent = 0;
  }
  showFeature(features);
}

/* Handle search input */
document.querySelector('input[type="search"]').addEventListener('change', e => {
  const value = e.target.value;
  if (value) {
    filter('Nom', value);
  } else {
    showStats(0);
  }
})
document.querySelector('input[type="search"]').addEventListener('input', e => {
  if (!e.target.value && !e.inputType) {
    e.target.blur()
  }
})

/* Handle select action */
document.querySelector('header select').value = '';
document.querySelector('header select').addEventListener('change', e => {
  const value = e.target.value;
  if (value === 'show') {
    // Show game
    document.querySelector('input[type="search"]').value = '';
    showStats(0);
  } else if (value === 'showall') {
    // Show all features
    document.querySelector('input[type="search"]').value = '.*';
    filter('Nom', '.*');
  } else if (value === 'center') {
    // Center on search
    if (document.querySelector('input[type="search"]').value) {
      mapAPI.setCenter({ layerId: 10, zoom: 16, offsetZoom: -0.5 });
    } else {
      mapAPI.setCenter({ layerId: 4, zoom: 16, offsetZoom: -0.5 });
    }
  }
  e.target.value = ''
})

/* Conversion

// La Reunion
var proj = 'EPSG:2975'
// Mayotte
proj = 'EPSG:4471'
// Guyanne
proj = 'EPSG:2972'
// Martinique
proj = 'EPSG:2973'
// Guadeloupe
proj = 'EPSG:2970'
// Saint-Pierre et Miquelon
proj = "EPSG:4467"
// Antilles
proj = "EPSG:4559"
proj = "EPSG:5490"

var pt = [ 
parseFloat(attr.coordonneeLambertAbscisseEtablissement),
parseFloat(attr.coordonneeLambertOrdonneeEtablissement)
]
console.log(pt)
pt = ol.projTransform(pt, proj, 'EPSG:3857')
console.log(pt)
feature.getGeometry().setCoordinates(pt)

return false

*/