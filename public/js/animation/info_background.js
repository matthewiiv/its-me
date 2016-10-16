// once everything is loaded, we run our Three.js stuff.

var cube, rendererInfo, sceneInfo, cameraInfo
var infoClock = new THREE.Clock(true)
var infoTick = 0

const portfolioCircleOptions = {
  size: [30, 25, 45, 35],
  color: ['#000000','#000000','#000000','#000000'],
  position: []
}

let circles = portfolioCircleOptions.size.map((el, index) => {
  const geometry = new THREE.CircleGeometry(el, 150);
  const material = new THREE.MeshBasicMaterial({
    color: portfolioCircleOptions.color[index],
  });
  return new THREE.Mesh(geometry, material) 
}) 

const starDeath = {
  time: 1,
  maxSize: 2,
  colour: '#ffffff'
}

function init() {
  sceneInfo = new THREE.Scene();
  var aspect = $('#info-wrapper').width() / $('#info-wrapper').height() ;

  const width = $('#info-wrapper').width() * 500 / 844;


  cameraInfo = new THREE.PerspectiveCamera(75, aspect, 1, 1000)
  rendererInfo = new THREE.WebGLRenderer({alpha: true});
  rendererInfo.setSize($('#info-wrapper').width(), $('#info-wrapper').height());
  $('#info-background').append(rendererInfo.domElement)
  circles.map((circle, index) => {
    circle.position.x = ((width / 5) * (index + 1)) - (width / 2)
    portfolioCircleOptions.position.push(circle.position) 
    circle.name = 'circle' + [index]
    sceneInfo.add(circle)
  })
  cameraInfo.position.z = 100
  animateInfo();

  $('#info-background').children()[0].addEventListener('mousedown', onCanvasMouseDown, false)
}

function render() {
  rendererInfo.render(sceneInfo, cameraInfo)
}

function animateInfo() {
  requestAnimationFrame(animateInfo);
  var delta = infoClock.getDelta();
  infoTick += delta;
  render();
}

function onCanvasMouseDown(event) {
  const canvas = $('#info-background').children()[0]
  const clickPosition = getCursorPosition(canvas, event)
  mouse.x = clickPosition.x;
  mouse.y = clickPosition.y;
  raycaster.setFromCamera(mouse, cameraInfo)
  var intersects = raycaster.intersectObjects(sceneInfo.children)
  intersects.map((el) => {
    circleClickEvent(el);
  })
}
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  const y = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 - 1;
  return {x, y};
}

function circleClickEvent(circle) {
  //circle.object.material.color.set('#ffffff')
  console.log(sceneInfo.getObjectByName('circle0'))
}

window.onload = init;
