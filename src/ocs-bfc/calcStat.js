//import Chart from 'chart.js/auto'
import { Chart } from 'chart.js'
import { couverture } from '../ocs-ge/style'

/** getChart */
export default function(stat, map, source, clip) {

  const chart = {
    element: document.getElementById(stat).querySelector('.pcent'),
    ctx: document.getElementById(stat).querySelector('canvas').getContext('2d'),
    config: {
      type: 'bar',
      data: {
        datasets: [{
          data: [],
          backgroundColor: []
        }],
        labels: []
      },
      options: {
        indexAxis: 'y',
        scales: {
          xAxis: {
            // max: 1000 // maximum value
          }
        },
        responsive: true,
        maintainAspectRatio: true,
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

  const config = chart.config;
  chart.show = (stats) => {
    console.log(stat, stats)
    const labels = config.data.labels = [];
    const data = config.data.datasets[0].data = [];
    const color = config.data.datasets[0].backgroundColor = [];
    for (let k in stats) {
      labels.push(couverture[k].name);
      data.push(stats[k]);
      color.push(couverture[k].color);
    }
    chart.chart.update();
  }
  return chart;
}