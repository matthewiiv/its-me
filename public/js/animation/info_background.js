// once everything is loaded, we run our Three.js stuff.
var infoParticleSystem, infoOptions, infoSpawnerOptions, spawnerTick = 0
var rendererInfo, sceneInfo, cameraInfo
var infoClock = new THREE.Clock(true)
var infoTick = 0
var clickedCircles = [];



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
  expandTime: 0.6,
  contractTime: 1,
  maxSize: 1.4,
  colour: '#ffffff'
}

function infoInit() {
  sceneInfo = new THREE.Scene();
  var aspect = $('#info-wrapper').width() / $('#info-wrapper').height() ;

  const width = $('#info-wrapper').width() * 500 / 844;


  cameraInfo = new THREE.PerspectiveCamera(75, aspect, 1, 10000)
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

  infoParticleSystem = new THREE.GPUParticleSystem({
    maxParticles: 500000
  });
  sceneInfo.add(infoParticleSystem)
  infoOptions = {
    containerCount: 1,
    position: new THREE.Vector3(),
    positionRandomness: 0,
    velocity: new THREE.Vector3(),
    velocityRandomness: 0,
    color: 0x000000,
    colorRandomness: .0,
    turbulence: 0,
    lifetime: 20,
    size: 3.5,
    sizeRandomness: 0
  };
  infoSpawnerOptions = {
    spawnRate: 150000,
  }
  animateInfo();

  $('#info-background').children()[0].addEventListener('mousedown', onCanvasMouseDown, false)
}

function render() {
  rendererInfo.render(sceneInfo, cameraInfo)
}
let test= 1
function animateInfo() {
  requestAnimationFrame(animateInfo);
  const delta = infoClock.getDelta();
  spawnerTick += delta;

  if (spawnerTick < 0) spawnerTick = 0;
  clickedCircles.map((el) => {

    let circle = sceneInfo.getObjectByName(el)
    if (infoTick <= 1) {
      infoTick += delta / starDeath.expandTime;
      circle.scale.x = Math.cos(infoTick * Math.PI / 2)
      circle.scale.y = Math.cos(infoTick * Math.PI / 2)
    }
    if (infoTick > 1) {
      circle.scale.x = 0;
      circle.scale.y = 0;
    0}
    if (/*infoTick > 0.8 && infoTick < 1.3*/test === 1) {
      test = 0
      infoTick += delta
      infoOptions.position.x = circle.position.x;
      infoOptions.position.y = circle.position.y;
      infoOptions.position.z = circle.position.z;
      for (var x = 0; x < 1000; x++) {
        // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
        // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
        const theta = Math.random() * 2 * Math.PI;
        let rand = Math.random();
        infoOptions.velocity.x = rand * Math.sin(theta);
        infoOptions.velocity.y = rand * Math.cos(theta);
        infoOptions.velocity.z = 0;
        infoParticleSystem.spawnParticle(infoOptions);
      }
    }

  })

  infoParticleSystem.update(spawnerTick)
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
  const y =  ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 - 1;
  return {x, y};
}

function circleClickEvent(circle) {
  //circle.object.material.color.set('#ffffff')
  clickedCircles.push(circle.object.name)
}

window.onload = infoInit;
