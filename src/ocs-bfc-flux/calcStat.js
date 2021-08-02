import { Chart } from 'chart.js'
import {SankeyController, Flow} from 'chartjs-chart-sankey/dist/chartjs-chart-sankey.esm';
import { couverture } from '../ocs-ge/style'

Chart.register(SankeyController, Flow);

function getColor(what) {
  const info = couverture[what.split('-')[1]];
  return info ? info.color : '#999999';
}

function getStat(stat) {
  const chart = {
    element: document.getElementById(stat).querySelector('.pcent'),
    ctx: document.getElementById(stat).querySelector('canvas').getContext('2d'),
    config: {
      type: 'sankey',
      data: {
        datasets: [{
          label: 'My sankey',
          data: [{ from: 'a', to: 'b', flow: 1 }],
          colorFrom: (c) => getColor(c.dataset.data[c.dataIndex].from),
          colorTo: (c) => getColor(c.dataset.data[c.dataIndex].to),
          colorMode: 'gradient', // or 'from' or 'to'
          /* optional labels */
          labels: {
            'a': ' ',
            'b': ' '
          }
        }]
      },
      options: {
        /*
        indexAxis: 'y',
        scales: {
          xAxis: {
            // max: 1000 // maximum value
          }
        },
        */
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: false, text: 'OCS-GE' },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.raw.flow;
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
    const data = config.data.datasets[0].data = [];
    const labels = config.data.datasets[0].labels;
    if (stats) {
      stats.forEach(s => {
        data.push({
          from: '1-'+s[0], 
          to: '2-'+s[1], 
          flow: s[2]
        });
        labels['1-'+s[0]] = s[0];
        labels['2-'+s[1]] = s[1];
      });
    } else {
      data.push({ from: 'a', to: 'b', flow: 1 });
    }
    chart.chart.update();
  }
  return chart;
}

export default getStat
