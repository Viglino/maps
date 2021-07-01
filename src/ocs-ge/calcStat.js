import { ol_extent_intersection } from 'ol-ext/geom/GeomUtils'
import { getArea } from 'ol/sphere';
import Chart from 'chart.js/auto'
import { couverture } from './style';


function calculate(chart, map, source)  {
  const ext = map.getView().calculateExtent();
  var features = source.getFeaturesInExtent(ext);
  const config = chart.config;
  const data = config.data.datasets[0].data = [0,0];
  config.data.labels = ['Surfaces anthropisées', 'Autre surface'];
  features.forEach(function(f) {
    const geom = ol_extent_intersection(ext, f.getGeometry());
    const cov = f.get('couverture');
    if (cov && geom) {
      const c = /^CS1.1/.test(cov) ? 0 : 1;
      data[c] += Math.round(getArea(geom, { 
        projection: map.getView().getProjection() 
      }));
    }
  });
  chart.chart.update();
}

export default function(stat, map, source) {
  let delay = null;

  const chart = {
    ctx: document.getElementById(stat).querySelector('canvas').getContext('2d'),
    config: {
      type: 'pie',
      data: {
        datasets: [{
          data: [],
          backgroundColor: [ '#ff377a', '#00a600']
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [],
      },
      options: {
        // title: { display: true, text: 'OCS-GE' },
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        // cutoutPercentage: 80,
        ___tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data['labels'][tooltipItem['index']] + ': ' + Math.round(data['datasets'][0]['data'][tooltipItem['index']]/data.datasets[0].sum*1000)/10 + '%';
            }
          }
        }
      }
    }
  }
  chart.chart = new Chart(chart.ctx, chart.config);

  map.on('moveend', (e) => {
    if (delay) {
      clearTimeout(delay);
      delay = null;
    }
    delay = setTimeout(() => calculate(chart, map, source), 100 );
  })
  source.on('tileloadend', (e) => {
    if (e.loading === e.loaded) calculate(chart, map, source);
  })
}