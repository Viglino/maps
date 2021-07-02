import { Map, View } from 'ol'
import Geoportail from 'ol-ext/layer/Geoportail'
import Search from 'ol-ext/control/SearchBAN'
import Permalink from 'ol-ext/control/Permalink'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'
import CanvasFilter from 'ol-ext/filter/CanvasFilter'
import ScaleLine from 'ol-ext/control/CanvasScaleLine'

/* Capabilities */
Geoportail.capabilities["ORTHOIMAGERY.ORTHOPHOTOS2006-2010"] = {"server":"https://wxs.ign.fr/geoportail/wmts","layer":"ORTHOIMAGERY.ORTHOPHOTOS2006-2010","title":"Photographies aériennes 2006-2010","format":"image/jpeg","style":"normal","queryable":false,"tilematrix":"PM","minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75],"desc":"Prises de vues aériennes des territoires disponibles à la fin des années 2006 à 2010","originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"https://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CG06":{"href":"http://www.cg06.fr","attribution":"Département Alpes Maritimes (06) en partenariat avec : Groupement Orthophoto 06 (NCA, Ville de Cannes, CARF, CASA,CG06, CA de Grasse) ","logo":"https://wxs.ign.fr/static/logos/CG06/CG06.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CG45":{"href":"http://www.loiret.com","attribution":"Le conseil général du Loiret","logo":"https://wxs.ign.fr/static/logos/CG45/CG45.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CRAIG":{"href":"http://www.craig.fr","attribution":"Centre Régional Auvergnat de l'Information Géographique (CRAIG)","logo":"https://wxs.ign.fr/static/logos/CRAIG/CRAIG.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"RGD_SAVOIE":{"href":"http://www.rgd.fr","attribution":"Régie de Gestion de Données des Pays de Savoie (RGD 73-74)","logo":"https://wxs.ign.fr/static/logos/RGD_SAVOIE/RGD_SAVOIE.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]}}};

/** Get a new map
 * @param {Element|string} target 
 * @param {bool} use a permalink 
 */
function getMap(date) {

  // Layers
  let tlayer;
  switch(date) {
    case 2015: {
      tlayer = ['ORTHOIMAGERY.ORTHOPHOTOS2006-2010', 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD']
      break;
    }
    case 2018: {
      tlayer = ['ORTHOIMAGERY.ORTHOPHOTOS', 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2']
      break;
    }
  }
  const layers = [
    new Geoportail({
      layer: tlayer[0],
      gppKey: 'h1osiyvfm7c4wu976jv6gpum',
      visible: false
    }),
    new Geoportail({
      gppKey: 'h1osiyvfm7c4wu976jv6gpum',
      layer: tlayer[1], 
      visible: true
    })
  ];

  // Grayscale
  var filter = new CanvasFilter({ grayscale: 100 });
  layers[0].addFilter(filter);
  layers[1].addFilter(filter);

  const map = new Map ({
    target: 'map-'+date,
    view: new View ({
      zoom: 14,
      center: [-130682, 5566802]
    }),
    layers: layers
  });

  map.addControl(new LayerSwitcher());
  if (date===2015) {
    map.addControl(new Search({ centerOnSelect: true }));
    const plink = new Permalink({ visible: false });
    map.addControl(plink);
    map.addControl(new ScaleLine)
  }

  return map;
}

export default getMap;
