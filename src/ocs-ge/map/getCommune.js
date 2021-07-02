import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { transform } from 'ol/proj';
import ol_ext_Ajax from 'ol-ext/util/Ajax';

const commune = new VectorSource();

function getCommune(map) {
  map.addLayer(new VectorLayer({
    title: 'Commune',
    source: commune
  }));
  map.on('click', (e) => {
    const coord = transform(e.coordinate, map.getView().getProjection(), 'EPSG:4326');
    ol_ext_Ajax.get({
      url: 'https://geo.api.gouv.fr/communes?lat='+coord[1]+'&lon='+coord[0]+'&fields=&format=geojson&geometry=contour',
      success: function(resp) {
        var format = new GeoJSON();
        var features = format.readFeatures(resp, {featureProjection: map.getView().getProjection(), dataProjection: 'EPSG:4326' });
        commune.clear();
        if (features.length) {
          commune.addFeatures(features);
          map.getView().fit(features[0].getGeometry().getExtent());
        }
      }
    })  
  });
}

export default getCommune;
export {commune}