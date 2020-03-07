//  http://meteo145.uibk.ac.at/innsbruck/7
// ["rr", "dd", "tp", "p", "tl", "so", "ff", "datumsec"]
const dataURL = 'data.json';
const tempChart = new Chart(document.getElementById('tempChart').getContext('2d'), {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: [],
    datasets: []
  },

  // Configuration options go here
  options: {
    tooltips: {
      mode: 'x-axis',
      intersect: true,
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
          tooltipFormat:'YYYY-MM-DD HH:mm',
          displayFormats: {
            hour: 'MMM DD HH:mm'
          }
        },
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        scaleLabel: {
        display: true,
        labelString: 'Temperature [\xB0C]',
        fontColor: 'RGB(255, 69, 0)',
      },
          id: 'Temperature',
          type: 'linear',
          position: 'left',
          gridLines: {
            display: false
          },
        },
        {
          scaleLabel: {
          display: true,
          labelString: 'Precipitation [mm/h]',
          fontColor: 'rgb(67, 160, 195)',
        },
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
          scaleLabel: {
          display: true,
          labelString: 'Sunshine Duration [min/10min]',
          fontColor: 'rgb(255, 215, 0)',
        },
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

const pressChart = new Chart(document.getElementById('pressChart').getContext('2d'), {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: [],
    datasets: []
  },

  // Configuration options go here
  options: {
    tooltips: {
      mode: 'x-axis',
      intersect: true,
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
        scaleLabel: {
        display: true,
        labelString: 'Date'
      },
        type: 'time',
        time: {
          tooltipFormat:'YYYY-MM-DD HH:mm',
          displayFormats: {
            hour: 'MMM DD HH:mm'
          }
        },
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        scaleLabel: {
        display: true,
        labelString: 'Pressure [hPa]',
        fontColor: 'RGB(71, 14, 143)',
      },
          id: 'Pressure',
          type: 'linear',
          position: 'left',
          gridLines: {
            display: false
          },
        },
        {
          scaleLabel: {
          display: true,
          labelString: 'Wind Direction [\xB0]',
          fontColor: 'rgba(143, 71, 14, 0.8)',
        },
          id: 'Winddirection',
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
          scaleLabel: {
          display: true,
          labelString: 'Wind Speed [m/s]',
          fontColor: 'rgb(14, 143, 71)',
        },
          id: 'Windspeed',
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


function updateTemperature(charts) {
  d3.json(dataURL).then(function(data) {
    const temperature = document.querySelector('.temperature');
    temperature.innerHTML = data.tl[data.tl.length - 1] + '&deg;C';
    const epoch = data.datumsec[data.datumsec.length - 1];
    const date = moment(epoch).format('YYYY-MM-DD HH:mm');
    const description = document.querySelector('.description');
    description.innerHTML = 'Innsbruck University Temperature on <br>' + date;
    updataTempChart(charts[0], data);
    updataPressChart(charts[1], data);
  });
}


updateTemperature([tempChart, pressChart]);
let timer = new Date();

function checkLastModified() {
  let now = new Date();
  if (now - timer > 5 * 60 * 1000) {
    updateTemperature([tempChart, pressChart]);
    timer = new Date();
  }
}
let interval = setInterval(checkLastModified, 500);

// Removes all datasets from the chart
function removeDataSets(chart) {
  chart.data.datasets = [];
}

// Adds single dataset to the chart
function addDataSet(chart, newDatSet) {
  chart.data.datasets.push(newDatSet);
}

// Updates chart lables removing old ones
function updateLabels(chart, newLabels) {
  chart.data.labels = [];
  newLabels.forEach((label) => {
    chart.data.labels.push(label);
  });
}

// Updates all datasets of the chart removing old ones
function updateDataSets(chart, newDatSets) {
  removeDataSets(chart);
  newDatSets.forEach((newDatSet) => {
    addDataSet(chart, newDatSet);
  });
  chart.update();
}

// Completely updates the chart (datasets and labels)
function updateChart(chart, newLabels, newDataSets) {
  updateLabels(chart, newLabels);
  updateDataSets(chart, newDataSets);
}

// Round Precipitation to 1 decimal and remove negative values
function removeNegativeRR(rr) {
  rr.forEach((prec, i) => {
    if (prec < 0) {
      rr[i] = 0;
    }
    rr[i] = prec.toFixed(1);
  });
}
// Round sunshine hours to 1 decimal
function roundSunshine(so) {
  so.forEach((sun, i) => {
      so[i] = sun.toFixed(1);
  });
}
// Map datasets according as needed (colors, ecc)
const dataMap = {
  'rr': {
    'label': 'Precipitation',
    'color': 'rgb(67, 160, 195)',
    'fill': true,
    'yAxisID': 'Precipitation',
    'showLine': true,
    'pointRadius': 0,
  },
  'tl': {
    'label': 'Temperature',
    'color': 'RGB(255, 69, 0)',
    'fill': false,
    'yAxisID': 'Temperature',
    'showLine': true,
    'pointRadius': 0,
  },
  'tp': {
    'label': 'Dewpoint',
    'color': 'RGB(0, 128, 128)',
    'fill': false,
    'yAxisID': 'Temperature',
    'showLine': true,
    'pointRadius': 0,
  },
  'p': {
    'label': 'Pressure',
    'color': 'RGB(71, 14, 143)',
    'fill': false,
    'yAxisID': 'Pressure',
    'showLine': true,
    'pointRadius': 0,
  },
  'so': {
    'label': 'Sunshine',
    'color': 'rgb(255, 215, 0)',
    'fill': true,
    'yAxisID': 'Sunshine',
    'showLine': true,
    'pointRadius': 0,
  },
  'ff': {
    'label': 'Windspeed',
    'color': 'rgb(14, 143, 71)',
    'fill': false,
    'yAxisID': 'Windspeed',
    'showLine': true,
    'pointRadius': 0,
  },
  'dd': {
    'label': 'Winddirection',
    'color': 'rgba(143, 71, 14, 0.8)',
    'fill': false,
    'yAxisID': 'Winddirection',
    'showLine': false,
    'pointRadius': 2,
  }
};

// Creates a new dataset object to pass to addDataSet()
function formatDataSet(key, jsonData) {
  const newDataset = {
    label: dataMap[key].label,
    backgroundColor: dataMap[key].color,
    borderColor: dataMap[key].color,
    data: jsonData[key],
    fill: dataMap[key].fill,
    yAxisID: dataMap[key].yAxisID,
    showLine: dataMap[key].showLine,
    pointRadius: dataMap[key].pointRadius,
  };
  return newDataset;
}

function updataTempChart(chart, data) {
  removeNegativeRR(data.rr);
  roundSunshine(data.so);
  const newDatSets = [
    formatDataSet('tl', data),
    formatDataSet('tp', data),
    formatDataSet('rr', data),
    formatDataSet('so', data)
  ];
  const newLabels = data.datumsec;
  updateChart(chart, newLabels, newDatSets);
}

function updataPressChart(chart, data) {
  const newDatSets = [
    formatDataSet('p', data),
    formatDataSet('ff', data),
    formatDataSet('dd', data),
  ];
  const newLabels = data.datumsec;
  updateChart(chart, newLabels, newDatSets);
}
