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
  console.log("Viewport size is " + width + "x" + height);
}

function updateTemperature() {
  const dataURL = 'http://acinn.uibk.ac.at/innsbruck/1';
  d3.json(dataURL).then(function(data) {
    const temperature = document.querySelector('.temperature');
    temperature.innerHTML = data.tl[data.tl.length - 1] + '°C';
    const epoch = data.datumsec[data.datumsec.length - 1];
    const date = new Date(epoch).toLocaleString();
    const description = document.querySelector('.description');
    description.innerHTML = 'Innsbruck University Temperature on <br>' + date;
  });
}
updateTemperature();
let interval = setInterval(updateTemperature, 5*60*1000);
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    updateTemperature();
    interval = setInterval(updateTemperature, 5*60*1000);
  } else {
    clearInterval(interval);
  }
});
