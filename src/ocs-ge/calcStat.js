import { ol_extent_intersection } from 'ol-ext/geom/GeomUtils'
import { getArea } from 'ol/sphere';
import Chart from 'chart.js/auto'


const mode = document.querySelector('#mode select');

/** Get cover index
 * @param {string} cov couverture
 * @return {number} index
 */
function getIndex(cov) {
  switch(mode.value) {
    case 'artif': return /^CS1.1/.test(cov) ? 0 : 1;
    default: return /^CS1.1.1/.test(cov) ? 0 : 1;
  }
}

/** Get labels
 * @returns {Array<string>}
 */
function getLabels() {
  switch(mode.value) {
    case 'artif': return ['Surfaces anthropisées', 'Autres surfaces']
    default: return ['Surfaces imperméabilisées', 'Autres surfaces']
  } 
};

/** Calculate stats
 */
function calculate(chart, map, source, clip)  {
  // Current extent
  const ext = clip.isActive() ? clip.getExtent() : map.getView().calculateExtent();
  // Clip circle ?
  const circle = clip.isActive() ? clip.getCircle() : null;
  // Features
  const features = source.getFeaturesInExtent(ext);
  const config = chart.config;
  const data = config.data.datasets[0].data = [0,0];
  config.data.labels = getLabels();
  document.body.className = mode.value;
  // Features area (ha)
  features.forEach(function(f) {
    let geom;
    if (circle) {
      geom = circle.intersection(f.getGeometry(), 10);
    } else {
      geom = ol_extent_intersection(ext, f.getGeometry());
    }
    const cov = f.get('couverture');
    if (cov && geom) {
      const c = getIndex(cov);
      data[c] += Math.round(getArea(geom, { 
        projection: map.getView().getProjection() 
      })) / 10000;
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
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false, text: 'OCS-GE' },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const fac = context.raw > 10 ? 10 : 100;
                return context.label + ' : ' + Math.round(context.raw*fac)/fac + ' ha';
              }
            }
          }
        }
      }
    }
  }
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