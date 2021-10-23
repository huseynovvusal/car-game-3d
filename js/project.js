const scene = new THREE.Scene();

scene.background = new THREE.Color(0x75d114);

// Camera

let aspect = window.innerWidth / window.innerHeight;

let width = 30;
let height = width / aspect;

const camera = new THREE.OrthographicCamera(
  width / -2,
  width / 2,
  height / 2,
  height / -2,
  0.1,
  100
);

camera.position.set(20, 15, 7);
camera.lookAt(0, 0, 0);

// Canvas

const canvas = document.querySelector(".game");

// Renderer

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

// Resize

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  aspect = window.innerWidth / window.innerHeight;
  width = 30;
  height = width / aspect;
  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = height / -2;
  camera.updateProjectionMatrix();
});

// Car

const game = new Game();

const car = game._car(1);
car.position.set(0, 0.5, 0);

let enemyCar = game.enemyCar(-1);

scene.add(car);
scene.add(enemyCar);

window.addEventListener("click", () => {
  if (
    !game.gameStarted &&
    !document.querySelector(".start").classList.contains("disable")
  ) {
    game.keyUpEvents = true;
    game.gameStarted = true;
    game.collusion = false;
    enemyCar.position.set(0, 0.5, -25);
    document.querySelector(".start").classList.add("disable");
    document.querySelector(".controls").classList.add("active");
  }
});

window.addEventListener("keyup", (e) => {
  game.keyUp(e, car, car.position.x);
});

document.querySelector(".left").addEventListener("click", () => {
  game.left(car, car.position.x);
});
document.querySelector(".right").addEventListener("click", () => {
  game.right(car, car.position.x);
});

// Enviroment

let enviroment = game._enviroment();

scene.add(enviroment);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(-3, 30, 0);
pointLight.castShadow = true;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 25;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambientLight);

// Helper

const grid = new THREE.GridHelper(100, 100);

const helper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(helper);
// scene.add(grid);

// Animate

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (game.gameStarted && !game.collusion) {
    game.moveEnemyCar(enemyCar);
    game._collusion(car, enemyCar);
  }
};

animate();
