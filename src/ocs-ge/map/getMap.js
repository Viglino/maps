import { Map, View } from 'ol'
import Geoportail from 'ol-ext/layer/Geoportail'
import Search from 'ol-ext/control/SearchBAN'
import Permalink from 'ol-ext/control/Permalink'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'
import CanvasFilter from 'ol-ext/filter/CanvasFilter'
import ScaleLine from 'ol-ext/control/CanvasScaleLine'

/* Capabilities */
Geoportail.register("ORTHOIMAGERY.ORTHOPHOTOS2006-2010", {"layer":"ORTHOIMAGERY.ORTHOPHOTOS2006-2010","theme":"orthohisto","desc":"Prises de vues aériennes des territoires disponibles à la fin des années 2006 à 2010","server":"https://data.geopf.fr/wmts","bbox":[-178.187,-21.4013,55.8561,51.091],"format":"image/jpeg","minZoom":6,"maxZoom":18,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":true,"style":"normal","tilematrix":"PM","title":"Photographies aériennes 2006-2010","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
Geoportail.register("ORTHOIMAGERY.ORTHOPHOTOS2011", {"layer":"ORTHOIMAGERY.ORTHOPHOTOS2011","theme":"orthohisto","desc":"Prises de vues aériennes des territoires disponibles à la fin de l'année 2011.","server":"https://data.geopf.fr/wmts","bbox":[-178.187,-21.4013,55.8561,51.091],"format":"image/jpeg","minZoom":6,"maxZoom":18,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"normal","tilematrix":"PM","title":"Photographies aériennes 2011","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
Geoportail.register("ORTHOIMAGERY.ORTHOPHOTOS2015", {"layer":"ORTHOIMAGERY.ORTHOPHOTOS2015","theme":"orthohisto","desc":"Prises de vues aériennes des territoires disponibles à la fin de l'année 2015.","server":"https://data.geopf.fr/wmts","bbox":[-178.187,-21.4013,55.8561,51.0945],"format":"image/jpeg","minZoom":0,"maxZoom":18,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"normal","tilematrix":"PM","title":"Photographies aériennes 2015","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
Geoportail.register("ORTHOIMAGERY.ORTHOPHOTOS.ORTHO-EXPRESS.2017", {"layer":"ORTHOIMAGERY.ORTHOPHOTOS.ORTHO-EXPRESS.2017","theme":"ortho","desc":"L’Ortho Express est une mosaïque d’ortho‐images numériques. Elle se différencie des autres produits orthophotographiques de l’IGN par le fait que, par souci de minimiser les délais de sa production, elle résulte d’un traitement massivement automatisé . L’Ortho Express vise en premier lieu à répondre à une exigence sur les délais de production. Il s’agit donc d’un produit dont les caractéristiques techniques sont contraintes par cette exigence forte.","server":"https://data.geopf.fr/wmts","bbox":[-179.5,-75,179.5,75],"format":"image/jpeg","minZoom":0,"maxZoom":19,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"normal","tilematrix":"PM","title":"ortho-express 2017","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
Geoportail.register("ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2015", {"layer":"ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2015","theme":"satellite","desc":"Agrégation des images Pleiades de l'année 2015","server":"https://data.geopf.fr/wmts","bbox":[-178.196,-37.8942,77.6156,51.0283],"format":"image/png","minZoom":0,"maxZoom":18,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"normal","tilematrix":"PM","title":"PLEIADES - 2015","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
Geoportail.register("ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2017", {"layer":"ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2017","theme":"satellite","desc":"Agrégation des images Pleiades de l'année 2017","server":"https://data.geopf.fr/wmts","bbox":[-63.1796,-21.4013,55.8465,51.1117],"format":"image/png","minZoom":0,"maxZoom":18,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"normal","tilematrix":"PM","title":"PLEIADES - 2017","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
Geoportail.register("ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2018", {"layer":"ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2018","theme":"satellite","desc":"Agrégation des images Pleiades de l'année 2018","server":"https://data.geopf.fr/wmts","bbox":[-63.1702,-21.4094,55.8649,51.0841],"format":"image/png","minZoom":0,"maxZoom":18,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"normal","tilematrix":"PM","title":"PLEIADES - 2018","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});

/** Get a new map
 * @param {Element|string} target 
 * @param {bool} use a permalink 
 */
function getMap(date, center) {

  // Layers
  let tlayer = [];
  switch(date) {
    case 2015: {
      tlayer = ['GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', 'ORTHOIMAGERY.ORTHOPHOTOS2015', 'ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2015']
      break;
    }
    case 2018: {
      tlayer = ['GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', 'ORTHOIMAGERY.ORTHOPHOTOS', 'ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2018']
      break;
    }
    case 2011: {
      tlayer = ['GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', 'ORTHOIMAGERY.ORTHOPHOTOS2011']
      break;
    }
    case 2017: {
      tlayer = ['GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', 'ORTHOIMAGERY.ORTHOPHOTOS.ORTHO-EXPRESS.2017']
      break;
    }
  }
  const layers = [];
  tlayer.forEach((layer, i) => {
    layers.unshift(new Geoportail({
      layer: layer,
      gppKey: /PLEIADES/.test(layer) ? 'satellite' : /ORTHOPHOTOS2|ORTHO-EXPRESS/.test(layer) ? 'orthohisto' : /ORTHO/.test(layer) ? 'essentiels' : /MAP/.test(layer) ? 'h1osiyvfm7c4wu976jv6gpum' : 'cartes', 
      visible: !i,
      baseLayer: true
    }))
  });

  // Grayscale
  var filter = new CanvasFilter({ grayscale: 100 });
  layers.forEach(l => l.addFilter(filter) );

  const map = new Map ({
    target: 'map-'+date,
    view: new View ({
      zoom: 14,
      center: center || [-130682, 5566802]
    }),
    layers: layers
  });

  map.addControl(new LayerSwitcher());
  if (date===2015 || date===2011) {
    map.addControl(new Search({ centerOnSelect: true }));
    const plink = new Permalink({ visible: false });
    map.addControl(plink);
    map.addControl(new ScaleLine)
  }

  return map;
}

export default getMap;
