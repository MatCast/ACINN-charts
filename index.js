const dataURL = 'data.json';
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.onload = showViewport;
window.onresize = showViewport;

function showViewport() {
  var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var height= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

function updateTemperature(chart) {
  d3.json(dataURL).then(function(data) {
    const temperature = document.querySelector('.temperature');
    temperature.innerHTML = data.tl[data.tl.length - 1] + '&deg;C';
    const epoch = data.datumsec[data.datumsec.length - 1];
    const date = moment(epoch).format('dddd MMMM Do YYYY, h:mm:ss a');
    const description = document.querySelector('.description');
    description.innerHTML = 'Innsbruck University Temperature on <br>' + date;
    addData(chart, data.datumsec, data.tl)
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
            // backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [
              // {x: new Date(), y: 175},
              // {x: new Date(), y: 176},
            ]
        }]
    },

    // Configuration options go here
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                  displayFormats: {
                      hour: 'YYYY-MM-DD HH:mm'
                  }
                }
            }]
        }
    }
});
updateTemperature(chart);
let timer = new Date();

function checkLastModified() {
  let now = new Date();
  if (now - timer > 5*60*1000) {
    updateTemperature(chart);
    timer = new Date();
  }
}
let interval = setInterval(checkLastModified, 500);

function addData(chart, labelArr, dataArr) {
    labelArr.forEach((label) => {
      // const epoch = label;
      const date = moment(label);
      chart.data.labels.push(date)
    });
    dataArr.forEach((data) => {
      chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
      });
    });

    chart.update();
}
