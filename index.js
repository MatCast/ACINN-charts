//  http://meteo145.uibk.ac.at/innsbruck/7
// ["rr", "dd", "tp", "p", "tl", "so", "ff", "datumsec"]
const dataURL = 'data.json';
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
// let vh = window.innerHeight * 0.01;
// // Then we set the value in the --vh custom property to the root of the document
// document.documentElement.style.setProperty('--vh', `${vh}px`);
//
// // We listen to the resize event
// window.addEventListener('resize', () => {
//     // We execute the same script as before
//     let vh = window.innerHeight * 0.01;
//     document.documentElement.style.setProperty('--vh', `${vh}px`);
// });
//
// window.onload = showViewport;
// window.onresize = showViewport;
//
// function showViewport() {
//   var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
//   var height= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
// }

function updateTemperature(chart) {
  d3.json(dataURL).then(function(data) {
    const temperature = document.querySelector('.temperature');
    temperature.innerHTML = data.tl[data.tl.length - 1] + '&deg;C';
    const epoch = data.datumsec[data.datumsec.length - 1];
    removeNegativeRR(data.rr);
    roundSunshine(data.so);
    const date = moment(epoch).format('YYYY-MM-DD HH:mm');
    const description = document.querySelector('.description');
    description.innerHTML = 'Innsbruck University Temperature on <br>' + date;
    const newDatSets = [
      formatDataSet('tl', data),
      formatDataSet('tp', data),
      formatDataSet('rr', data),
      formatDataSet('so', data)
    ];
    const newLabels = data.datumsec;
    updateChart(chart, newLabels, newDatSets);
  });
}
var ctx = document.getElementById('tempChart').getContext('2d');
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: [],
    datasets: [{
      label: 'Temeprature',
      backgroundColor: 'rgb(255, 255, 255, 0)',
      borderColor: '#43A0C3',
      data: [
        // {x: new Date(), y: 175},
        // {x: new Date(), y: 176},
      ]
    }]
  },

  // Configuration options go here
  options: {
    tooltips: {
      mode: 'x-axis',
      intersect: true,
    },
    elements: {
      point: {
        radius: 1
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          displayFormats: {
            hour: 'MMM DD HH:mm'
          }
        },
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
          id: 'Temperature',
          type: 'linear',
          position: 'left',
          gridLines: {
            display: false
          },
        },
        {
          id: 'Precipitation',
          type: 'linear',
          position: 'right',
          ticks: {
            min: 0
          },
          gridLines: {
            display: false
          },
        },
        {
          id: 'Sunshine',
          type: 'linear',
          position: 'right',
          ticks: {
            min: 0
          },
          gridLines: {
            display: false
          },
        }
      ]
    }
  }
});
updateTemperature(chart);
let timer = new Date();

function checkLastModified() {
  let now = new Date();
  if (now - timer > 5 * 60 * 1000) {
    updateTemperature(chart);
    timer = new Date();
  }
}
let interval = setInterval(checkLastModified, 500);

function addData(chart, labelArr, dataArr) {
  labelArr.forEach((label) => {
    // const epoch = label;
    const date = moment(label);
    chart.data.labels.push(date);
  });
  dataArr.forEach((data) => {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
  });

  chart.update();
}

function removeDataSets(chart) {
  chart.data.datasets = [];
}

function addDataSet(chart, newDatSet) {
  chart.data.datasets.push(newDatSet);
  chart.update();
}

function updateLabels(chart, newLabels) {
  chart.data.labels = [];
  newLabels.forEach((label) => {
    chart.data.labels.push(label);
  });
}

function updateDataSets(chart, newDatSets) {
  removeDataSets(chart);
  newDatSets.forEach((newDatSet) => {
    addDataSet(chart, newDatSet);
  });
  chart.update();
}

function updateChart(chart, newLabels, newDataSets) {
  updateLabels(chart, newLabels);
  updateDataSets(chart, newDataSets);
}

function removeNegativeRR(rr) {
  rr.forEach((prec, i) => {
    if (prec < 0) {
      rr[i] = 0;
    }
    rr[i] = prec.toFixed(1);
  });
}

function roundSunshine(so) {
  so.forEach((sun, i) => {
      so[i] = sun.toFixed(1);
  });
}

const dataMap = {
  'rr': {
    'label': 'Precipitation',
    'color': 'rgb(67, 160, 195)',
    'fill': true,
    'yAxisID': 'Precipitation',
  },
  'tl': {
    'label': 'Temperature',
    'color': 'RGB(255, 69, 0)',
    'fill': false,
    'yAxisID': 'Temperature',
  },
  'tp': {
    'label': 'Dewpoint',
    'color': 'RGB(0, 128, 128)',
    'fill': false,
    'yAxisID': 'Temperature',
  },
  'p': {
    'label': 'Pressure',
    'color': 'RGB(75, 0, 130)',
    'fill': false,
    'yAxisID': 'Pressure',
  },
  'so': {
    'label': 'Sunshine',
    'color': 'rgb(255, 215, 0)',
    'fill': true,
    'yAxisID': 'Sunshine',
  },
  'ff': {
    'label': 'Windspeed',
    'color': 'RGB(46, 139, 87)',
    'fill': false,
    'yAxisID': 'Windspeed',
  },
  'dd': {
    'label': 'Winddirection',
    'color': 'rgb(0, 0, 0)',
    'fill': false,
    'yAxisID': 'Winddirection',
  }
};

function formatDataSet(key, jsonData) {
  const newDataset = {
    label: dataMap[key].label,
    backgroundColor: dataMap[key].color,
    borderColor: dataMap[key].color,
    data: jsonData[key],
    fill: dataMap[key].fill,
    yAxisID: dataMap[key].yAxisID,
  };
  return newDataset;
}
