import { Map, View } from 'ol'
import Geoportail from 'ol-ext/layer/Geoportail'
import Search from 'ol-ext/control/SearchBAN'
import Permalink from 'ol-ext/control/Permalink'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'
import CanvasFilter from 'ol-ext/filter/CanvasFilter'
import ScaleLine from 'ol-ext/control/CanvasScaleLine'

/* Capabilities */
Geoportail.capabilities["ORTHOIMAGERY.ORTHOPHOTOS2006-2010"] = {"server":"https://wxs.ign.fr/geoportail/wmts","layer":"ORTHOIMAGERY.ORTHOPHOTOS2006-2010","title":"Photographies aériennes 2006-2010","format":"image/jpeg","style":"normal","queryable":false,"tilematrix":"PM","minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75],"desc":"Prises de vues aériennes des territoires disponibles à la fin des années 2006 à 2010","originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"https://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CG06":{"href":"http://www.cg06.fr","attribution":"Département Alpes Maritimes (06) en partenariat avec : Groupement Orthophoto 06 (NCA, Ville de Cannes, CARF, CASA,CG06, CA de Grasse) ","logo":"https://wxs.ign.fr/static/logos/CG06/CG06.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CG45":{"href":"http://www.loiret.com","attribution":"Le conseil général du Loiret","logo":"https://wxs.ign.fr/static/logos/CG45/CG45.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CRAIG":{"href":"http://www.craig.fr","attribution":"Centre Régional Auvergnat de l'Information Géographique (CRAIG)","logo":"https://wxs.ign.fr/static/logos/CRAIG/CRAIG.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"RGD_SAVOIE":{"href":"http://www.rgd.fr","attribution":"Régie de Gestion de Données des Pays de Savoie (RGD 73-74)","logo":"https://wxs.ign.fr/static/logos/RGD_SAVOIE/RGD_SAVOIE.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]}}};
Geoportail.capabilities["ORTHOIMAGERY.ORTHOPHOTOS2015"] = {"server":"https://wxs.ign.fr/geoportail/wmts","layer":"ORTHOIMAGERY.ORTHOPHOTOS2015","title":"Ortho-photo 2015","format":"image/jpeg","style":"normal","queryable":false,"tilematrix":"PM","minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75],"desc":"Prises de vues aériennes des territoires disponibles à la fin de l'année 2015.","originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"https://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CG06":{"href":"http://www.cg06.fr","attribution":"Département Alpes Maritimes (06) en partenariat avec : Groupement Orthophoto 06 (NCA, Ville de Cannes, CARF, CASA,CG06, CA de Grasse) ","logo":"https://wxs.ign.fr/static/logos/CG06/CG06.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CG45":{"href":"http://www.loiret.com","attribution":"Le conseil général du Loiret","logo":"https://wxs.ign.fr/static/logos/CG45/CG45.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CRAIG":{"href":"http://www.craig.fr","attribution":"Centre Régional Auvergnat de l'Information Géographique (CRAIG)","logo":"https://wxs.ign.fr/static/logos/CRAIG/CRAIG.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"RGD_SAVOIE":{"href":"http://www.rgd.fr","attribution":"Régie de Gestion de Données des Pays de Savoie (RGD 73-74)","logo":"https://wxs.ign.fr/static/logos/RGD_SAVOIE/RGD_SAVOIE.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"e-Megalis":{"href":"http://www.e-megalisbretagne.org//","attribution":"Syndicat mixte de coopération territoriale (e-Megalis)","logo":"https://wxs.ign.fr/static/logos/e-Megalis/e-Megalis.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"SIGLR":{"href":"http://www.siglr.org//","attribution":"SIGLR","logo":"https://wxs.ign.fr/static/logos/SIGLR/SIGLR.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"PPIGE":{"href":"http://www.ppige-npdc.fr/","attribution":"PPIGE","logo":"https://wxs.ign.fr/static/logos/PPIGE/PPIGE.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"FEDER2":{"href":"http://www.europe-en-france.gouv.fr/","attribution":"Fonds européen de développement économique et régional","logo":"https://wxs.ign.fr/static/logos/FEDER2/FEDER2.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"FEDER":{"href":"http://www.europe-en-france.gouv.fr/","attribution":"Fonds européen de développement économique et régional","logo":"https://wxs.ign.fr/static/logos/FEDER/FEDER.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CRCORSE":{"href":"http://www.corse.fr//","attribution":"CRCORSE","logo":"https://wxs.ign.fr/static/logos/CRCORSE/CRCORSE.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_ALSACE":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_ALSACE/CNES_ALSACE.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_AUVERGNE":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_AUVERGNE/CNES_AUVERGNE.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_971":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_971/CNES_971.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_972":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_972/CNES_972.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_974":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_974/CNES_974.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_975":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_975/CNES_975.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_976":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_976/CNES_976.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_977":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_977/CNES_977.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"CNES_978":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES_978/CNES_978.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]},"FEDER_PAYSDELALOIRE":{"href":"http://www.europe-en-paysdelaloire.eu/","attribution":"Pays-de-la-Loire","logo":"https://wxs.ign.fr/static/logos/FEDER_PAYSDELALOIRE/FEDER_PAYSDELALOIRE.gif","minZoom":6,"maxZoom":18,"constraint":[{"minZoom":6,"maxZoom":18,"bbox":[-179.5,-75,179.5,75]}]}}};
Geoportail.capabilities["ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2015"] = {"server":"https://wxs.ign.fr/geoportail/wmts","layer":"ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2015","title":"PLEIADES - 2015","format":"image/png","style":"normal","queryable":false,"tilematrix":"PM","minZoom":0,"maxZoom":18,"bbox":[-179.5,-75,179.5,75],"desc":"Agrégation des images Pleiades de l'année 2015","originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"https://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-178.19646,-37.89419,77.61559,51.028297]}]},"CNES":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES/CNES.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-178.19646,-37.89419,77.61559,51.028297]}]},"AIRBUS":{"href":"http://www.geo-airbusds.com/","attribution":"Airbus Defence and Space","logo":"https://wxs.ign.fr/static/logos/AIRBUS/AIRBUS.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-178.19646,-37.89419,77.61559,51.028297]}]}}}
Geoportail.capabilities["ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2018"] = {"server":"https://wxs.ign.fr/geoportail/wmts","layer":"ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2018","title":"PLEIADES - 2018","format":"image/png","style":"normal","queryable":false,"tilematrix":"PM","minZoom":0,"maxZoom":18,"bbox":[-63.17017,-21.409384,55.864906,51.08409],"desc":"Agrégation des images Pleiades de l'année 2018","originators":{"IGN":{"href":"http://www.ign.fr","attribution":"Institut national de l'information géographique et forestière","logo":"https://wxs.ign.fr/static/logos/IGN/IGN.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-63.17017,-21.409384,55.864906,51.08409]}]},"CNES":{"href":"http://www.cnes.fr/","attribution":"Centre national d'études spatiales (CNES)","logo":"https://wxs.ign.fr/static/logos/CNES/CNES.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-63.17017,-21.409384,55.864906,51.08409]}]},"AIRBUS":{"href":"http://www.geo-airbusds.com/","attribution":"Airbus Defence and Space","logo":"https://wxs.ign.fr/static/logos/AIRBUS/AIRBUS.gif","minZoom":0,"maxZoom":18,"constraint":[{"minZoom":0,"maxZoom":18,"bbox":[-63.17017,-21.409384,55.864906,51.08409]}]}}};

/** Get a new map
 * @param {Element|string} target 
 * @param {bool} use a permalink 
 */
function getMap(date) {

  // Layers
  let tlayer;
  switch(date) {
    case 2015: {
      tlayer = ['GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD', 'ORTHOIMAGERY.ORTHOPHOTOS2015', 'ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2015']
      break;
    }
    case 2018: {
      tlayer = ['GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', 'ORTHOIMAGERY.ORTHOPHOTOS', 'ORTHOIMAGERY.ORTHO-SAT.PLEIADES.2018']
      break;
    }
  }
  const layers = [];
  tlayer.forEach((layer, i) => {
    layers.unshift(new Geoportail({
      layer: layer,
      gppKey: 'h1osiyvfm7c4wu976jv6gpum',
      visible: !i,
      baseLayer: true
    }))
  });

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
