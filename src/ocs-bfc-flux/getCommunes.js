import { getSource } from '../ocs-bfc/getWFS'
import VectorImage from 'ol/layer/VectorImage'
import Ajax from 'ol-ext/util/Ajax'

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
        f.set('flux', insee);
      });
    }
  
    // Jointure au chargement
    source.on('tileloadend', e => {
      if (!json) {
        json = {};
        Ajax.get({
          url: './ocsbfc/flux-2011-2017.csv',
          dataType: 'CSV',
          success: (csv) => {
            let title
            csv = csv.replace(/\r/g,'').split('\n');
            csv.forEach((l,i) => {
              l = csv[i] = l.split(';');
              if (i>0) {
                l[3] = parseFloat(l[3]);
                if (!json[l[0]]) json[l[0]] = [];
                json[l[0]].push([l[1],l[2],l[3]]);
              } else {
                title = csv[0];
              }
            });
            window.csv = csv;
            window.json = json;
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
  
  export default getCommunes