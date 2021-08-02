import TileWFS from 'ol-ext/source/TileWFS'
import VectorImage from 'ol/layer/VectorImage'
import getStyle from '../ocs-ge/style'
import ProgressBar from 'ol-ext/control/ProgressBar'
import Ajax from 'ol-ext/util/Ajax'

// get source source
function getSource(type, tzoom) {
  var source = new TileWFS({
    url: 'https://wxs.ign.fr/bx2thym8mdaruj2dg6ogfsi0/geoportail/wfs',
    typeName: type,
    tileZoom: tzoom || 15,
    featureLimit: 20000
  });
  source.on('overload', (e) => console.log(e) );
  return source;
}

export { getSource }

/** getWFS
 * @param {Map} map
 * @param {string} type wfs typename
 */
export default function(map, date) {
  const layer = new VectorImage({
    title: 'OCS-GE',
    className: 'blend',
    source: getSource(date === 2011 ? 'OCS.BFC.2011:ocsge_58_2011_20p' : 'OCS.BFC.2017:ocsge_58_2017_man_20p'),
    style: getStyle,
    opacity: 1,
    minZoom: 13  // prevent load on small zoom 
  });
  map.addLayer(layer);
  map.addControl(new ProgressBar({ 
    layers: layer
  }));
  return layer;
}

/** getWFS
 * @param {Map} map
 * @param {string} type wfs typename
 */
function getIndicator(map, date) {
  const layer = new VectorImage({
    title: 'Indicateur 9',
    className: 'blend',
    source: getSource('OCS.BFC.'+date+':indicateur9_'+date),
    // style: getStyle,
    opacity: 1,
    minZoom: 13  // prevent load on small zoom 
  });
  map.addLayer(layer);
  return layer;
}

export { getIndicator } 

/** getCommunes
 * @param {Map} map
 * @param {string} type wfs typename
 */
function getCommunes(map, date) {
  const source = getSource('OCS.BFC.'+date+':communes', 8);
  let json;
  
  // Faire la jointure...
  function jointure() {
    source.getFeatures().forEach(f => {
      const insee = json[f.get('insee_com')];
      for (let k in insee) {
        f.set(k, insee[k]);
      }
    });
  }

  // Jointure au chargement
  source.on('tileloadend', e => {
    if (!json) {
      json = {};
      Ajax.get({
        url: './ocsbfc/ind9-'+date+'.csv',
        dataType: 'CSV',
        success: (csv) => {
          let title
          csv = csv.replace(/\r/g,'').split('\n');
          csv.forEach((l,i) => {
            csv[i] = l.split(';');
            if (i>0) {
              csv[i].forEach((c,j) => {
                if (j>0) {
                  json[csv[i][0]][title[j]] = parseFloat(c) || 0;
                } else {
                  json[csv[i][0]] = {};
                }
              })
            } else {
              title = csv[0];
            }
          });
          jointure();
        },
        options: {
          abort: false,
        }
      });
    } else {
      jointure();
    }
  });

  const layer = new VectorImage({
    title: 'Communes '+date,
    className: 'blend',
    source: source,
    // style: getStyle,
    opacity: 1,
    minZoom: 10  // prevent load on small zoom 
  });
  map.addLayer(layer);
  return layer;
}

export { getCommunes } 
