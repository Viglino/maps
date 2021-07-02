import { ol_extent_intersection } from 'ol-ext/geom/GeomUtils'
import { getArea } from 'ol/sphere';
import Chart from 'chart.js/auto'

/** Calculate stats
 */
function calculate(chart, map, source, clip)  {
  const ext = clip.isActive() ? clip.getExtent() : map.getView().calculateExtent();
  const circle = clip.isActive() ? clip.getCircle() : null;
  const features = source.getFeaturesInExtent(ext);
  const config = chart.config;
  const data = config.data.datasets[0].data = [0,0];
  features.forEach(function(f) {
    let geom;
    if (circle) {
      geom = circle.intersection(f.getGeometry(), 10);
    } else {
      geom = ol_extent_intersection(ext, f.getGeometry());
    }
    const cov = f.get('couverture');
    if (cov && geom) {
      const c = /^CS1.1/.test(cov) ? 0 : 1;
      data[c] += Math.round(getArea(geom, { 
        projection: map.getView().getProjection() 
      }));
    }
  });
  const pc = data[1] ? Math.round(100*data[1]/(data[0]+data[1])) : '-';
  chart.element.innerText = pc;
  chart.chart.update();
}

/** getChart */
export default function(stat, map, source, clip) {
  let delay = null;

  const chart = {
    element: document.getElementById(stat).querySelector('.pcent'),
    ctx: document.getElementById(stat).querySelector('canvas').getContext('2d'),
    config: {
      type: 'pie',
      data: {
        datasets: [{
          data: [],
          backgroundColor: [ '#ff377a', '#00a600']
        }],
        labels: ['Surfaces anthropisées', 'Autre surface']
      },
      options: {
        title: { display: true, text: 'OCS-GE' },
        legend: { display: false },
        responsive: false,
        maintainAspectRatio: false,
        tooltips: { enabled: false }
        /*
        // cutoutPercentage: 80,
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data['labels'][tooltipItem['index']] + ': ' + Math.round(data['datasets'][0]['data'][tooltipItem['index']]/data.datasets[0].sum*1000)/10 + '%';
            }
          }
        }
        */
      }
    }
  }
  Chart.defaults.plugins.legend.display = false;
  chart.chart = new Chart(chart.ctx, chart.config);

  // Refresh on moveend and tileload
  map.on('moveend', () => {
    if (delay) {
      clearTimeout(delay);
      delay = null;
    }
    delay = setTimeout(chart.refresh, 100 );
  });
  source.on('tileloadend', (e) => {
    if (e.loading === e.loaded) chart.refresh();
  });
  map.on('clip', () => {
    if (delay) {
      clearTimeout(delay);
      delay = null;
    }
    delay = setTimeout(chart.refresh, 100 );
  });

  chart.refresh = () => {
    calculate(chart, map, source, clip);
  }
  return chart;
}