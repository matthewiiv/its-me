

var camera, tick = 0,
  scene, landingRenderer, clock = new THREE.Clock(true),
  controls, container, gui = new dat.GUI(),
  options, spawnerOptions, particleSystem;
landingInit();
landingAnimate();
function landingInit() {
  const landingBackground = document.getElementById('landing-background');
  camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 100;
  scene = new THREE.Scene();
  // The GPU Particle system extends THREE.Object3D, and so you can use it
  // as you would any other scene graph component.	Particle positions will be
  // relative to the position of the particle system, but you will probably only need one
  // system for your whole scene
  particleSystem = new THREE.GPUParticleSystem({
    maxParticles: 1000000
  });
  scene.add(particleSystem);
  // options passed during each spawned
  options = {
    containerCount: 1,
    position: new THREE.Vector3(),
    positionRandomness: .3,
    velocity: new THREE.Vector3(),
    velocityRandomness: .5,
    color: 0x000000,
    colorRandomness: .0,
    turbulence: 1.5,
    lifetime: 25,
    size: 3.5,
    sizeRandomness: 1
  };
  spawnerOptions = {
    spawnRate: 15000,
    horizontalSpeed: 1,
    verticalSpeed: 0.9,
    timeScale: 1
  }
  landingRenderer = new THREE.WebGLRenderer({alpha: true});
  landingRenderer.setPixelRatio(window.devicePixelRatio);
  landingRenderer.setSize($('#header-wrapper').width(), $('#header-wrapper').height());
  landingBackground.appendChild(landingRenderer.domElement);
  // setup controls
  controls = new THREE.TrackballControls(camera, landingRenderer.domElement);
  controls.rotateSpeed = 5.0;
  controls.zoomSpeed = 2.2;
  controls.panSpeed = 1;
  controls.dynamicDampingFactor = 0.3;
  window.addEventListener('resize', landingOnWindowResize, false);
}
function landingOnWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  landingRenderer.setSize($('#header-wrapper').width(), $('#header-wrapper').height());
}
function landingAnimate() {
  requestAnimationFrame(landingAnimate);
  controls.update();
  var delta = clock.getDelta() * spawnerOptions.timeScale;
  tick += delta;
  if (tick < 0) tick = 0;
  if (delta > 0) {
    options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20;
    options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
    options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;
    for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
      // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
      // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
      particleSystem.spawnParticle(options);
    }
  }
  particleSystem.update(tick);
  landingRender();
}
function landingRender() {
  landingRenderer.render(scene, camera);
}
