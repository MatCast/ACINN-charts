// attributes: ["rr", "dd", "tp", "p", "tl", "so", "ff", "datumsec"]
// Map datasets as needed (colors, ecc)
// from here you can configure any option for each of the weather vairable
let days = 1;
const temperature = document.querySelector("#temp-value");
const description = document.querySelector(".station-time");
const wind = document.querySelector("#wind-value");
const timeButtons = document.querySelectorAll(".time-window-button");
timeButtons.forEach((btn) => {
  btn.addEventListener("click", changeTimeWindow);
});

const dataMap = {
  rr: {
    label: "Precipitation",
    color: "rgb(67, 160, 195)",
    fill: true,
    yAxisID: "Precipitation",
    showLine: true,
    pointRadius: 0,
  },
  tl: {
    label: "Temperature",
    color: "rgb(255, 69, 0)",
    fill: false,
    yAxisID: "Temperature",
    showLine: true,
    pointRadius: 0,
  },
  tp: {
    label: "Dewpoint",
    color: "rgb(1, 103, 103)",
    fill: false,
    yAxisID: "Temperature",
    showLine: true,
    pointRadius: 0,
  },
  p: {
    label: "Pressure",
    color: "rgba(0, 0, 0)",
    fill: false,
    yAxisID: "Pressure",
    showLine: true,
    pointRadius: 0,
  },
  so: {
    label: "Sunshine",
    color: "rgb(255, 215, 0)",
    fill: true,
    yAxisID: "Sunshine",
    showLine: true,
    pointRadius: 0,
  },
  ff: {
    label: "Windspeed",
    color: "rgb(14, 143, 71)",
    fill: false,
    yAxisID: "Windspeed",
    showLine: true,
    pointRadius: 0,
  },
  dd: {
    label: "Winddirection",
    color: "rgb(71, 14, 143, 0.7)",
    fill: false,
    yAxisID: "Winddirection",
    showLine: false,
    pointRadius: 2,
  },
};
// data: http://meteo145.uibk.ac.at/innsbruck/7
// http://meteo145.uibk.ac.at/obergurgl/7
const dataURL = "innsbruck/data.json";
//  temperature chart
const tempChart = new Chart(
  document.getElementById("tempChart").getContext("2d"),
  {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: [],
      datasets: [],
    },

    // Configuration options go here
    options: {
      tooltips: {
        mode: "x-axis",
        intersect: true,
      },
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              tooltipFormat: "YYYY-MM-DD HH:mm",
              displayFormats: {
                hour: "MMM DD HH:mm",
              },
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Temperature [\xB0C]",
              fontColor: dataMap.tl.color,
            },
            id: "Temperature",
            type: "linear",
            position: "left",
            gridLines: {
              display: false,
            },
          },
          {
            scaleLabel: {
              display: true,
              labelString: "Precipitation [mm/h]",
              fontColor: dataMap.rr.color,
            },
            id: "Precipitation",
            type: "linear",
            position: "right",
            ticks: {
              min: 0,
            },
            gridLines: {
              display: false,
            },
          },
          {
            scaleLabel: {
              display: true,
              labelString: "Sunshine Duration [min/10min]",
              fontColor: dataMap.so.color,
            },
            id: "Sunshine",
            type: "linear",
            position: "right",
            ticks: {
              min: 0,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  }
);

//  pressure chart
const pressChart = new Chart(
  document.getElementById("pressChart").getContext("2d"),
  {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: [],
      datasets: [],
    },

    // Configuration options go here
    options: {
      tooltips: {
        mode: "x-axis",
        intersect: true,
      },
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
            },
            type: "time",
            time: {
              tooltipFormat: "YYYY-MM-DD HH:mm",
              displayFormats: {
                hour: "MMM DD HH:mm",
              },
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Pressure [hPa]",
              fontColor: dataMap.p.color,
            },
            id: "Pressure",
            type: "linear",
            position: "left",
            gridLines: {
              display: false,
            },
          },
          {
            scaleLabel: {
              display: true,
              labelString: "Wind Direction [\xB0]",
              fontColor: dataMap.dd.color,
            },
            id: "Winddirection",
            type: "linear",
            position: "right",
            ticks: {
              min: 0,
            },
            gridLines: {
              display: false,
            },
          },
          {
            scaleLabel: {
              display: true,
              labelString: "Wind Speed [m/s]",
              fontColor: dataMap.ff.color,
            },
            id: "Windspeed",
            type: "linear",
            position: "right",
            ticks: {
              min: 0,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  }
);

function updateTemperature(charts) {
  d3.json(dataURL).then(function (data) {
    temperature.innerHTML = data.tl[data.tl.length - 1] + "&deg;C";
    let ddWind = degToCard(data.dd[data.dd.length - 1]);
    wind.innerHTML = data.ff[data.ff.length - 1] + "m/s " + ddWind;
    const epoch = data.datumsec[data.datumsec.length - 1];
    const date = moment(epoch).format("YYYY-MM-DD HH:mm");
    description.innerHTML = "Innsbruck University at <br>" + date;
    let dataToShow = timeWindow(data, days);
    updataTempChart(charts[0], dataToShow);
    updataPressChart(charts[1], dataToShow);
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

function removeExtremeTemp(tt) {
  tt.forEach((t, i) => {
    if ((t < -50.0) | (t > 50.0)) {
      if (i - 5 > 0) {
        tt[i] = tt[i - 1];
      } else {
        tt[i] = tt[i + 1];
      }
    }
  });
}

function timeWindow(data, days) {
  let start = data.tp.length - days * 6 * 24;
  const dataToShow = {};
  for (const key in data) {
    dataToShow[key] = data[key].slice(start);
  }
  return dataToShow;
}

function changeTimeWindow(e) {
  timeButtons.forEach( b => b.classList.remove('active'));
  days = parseInt(e.target.dataset.day);
  e.target.classList.add('active')
  updateTemperature([tempChart, pressChart]);
}

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

// updates the temperature chart
function updataTempChart(chart, data) {
  removeNegativeRR(data.rr);
  roundSunshine(data.so);
  removeExtremeTemp(data.tp);
  removeExtremeTemp(data.tl);
  const newDatSets = [
    formatDataSet("tl", data),
    formatDataSet("tp", data),
    formatDataSet("rr", data),
    formatDataSet("so", data),
  ];
  const newLabels = data.datumsec;
  updateChart(chart, newLabels, newDatSets);
}

// updates the pressure chart
function updataPressChart(chart, data) {
  const newDatSets = [
    formatDataSet("p", data),
    formatDataSet("ff", data),
    formatDataSet("dd", data),
  ];
  const newLabels = data.datumsec;
  updateChart(chart, newLabels, newDatSets);
}

// Transforms wind directions from degrees to cardinal
function degToCard(deg) {
  if (deg > 11.25 && deg < 33.75) {
    return "NNE";
  } else if (deg > 33.75 && deg < 56.25) {
    return "ENE";
  } else if (deg > 56.25 && deg < 78.75) {
    return "E";
  } else if (deg > 78.75 && deg < 101.25) {
    return "ESE";
  } else if (deg > 101.25 && deg < 123.75) {
    return "ESE";
  } else if (deg > 123.75 && deg < 146.25) {
    return "SE";
  } else if (deg > 146.25 && deg < 168.75) {
    return "SSE";
  } else if (deg > 168.75 && deg < 191.25) {
    return "S";
  } else if (deg > 191.25 && deg < 213.75) {
    return "SSW";
  } else if (deg > 213.75 && deg < 236.25) {
    return "SW";
  } else if (deg > 236.25 && deg < 258.75) {
    return "WSW";
  } else if (deg > 258.75 && deg < 281.25) {
    return "W";
  } else if (deg > 281.25 && deg < 303.75) {
    return "WNW";
  } else if (deg > 303.75 && deg < 326.25) {
    return "NW";
  } else if (deg > 326.25 && deg < 348.75) {
    return "NNW";
  } else {
    return "N";
  }
}
