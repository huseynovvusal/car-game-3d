class Game {
  constructor() {
    this.colors = [0xdd0b0b, 0xdd690b, 0x74cc10, 0xe24dce];
    this.velocity = 0.4;
    this.startPosition = -25;
    this.collusion = false;
    this.keyUpEvents = false;
    this.gameStarted = false;
    this.score = 0;
    this.scoreValue = 1;
  }

  _car(cabinZ) {
    this.cabinZ = cabinZ;
    const car = new THREE.Group();

    const main = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 1.5, 7),
      new THREE.MeshPhongMaterial({ color: this.randomCarColor(this.colors) })
    );
    main.receiveShadow = true;
    main.castShadow = true;
    main.position.set(0, 0.75, 0);
    car.add(main);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 1.5, 3),
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    );
    cabin.position.set(0, 2.25, this.cabinZ);

    cabin.receiveShadow = true;
    cabin.castShadow = true;
    car.add(cabin);

    const wheelB = this.wheel(2);
    car.add(wheelB);

    const wheelF = this.wheel(-2);
    car.add(wheelF);

    return car;
  }

  wheel(z) {
    const wheel = new THREE.Mesh(
      new THREE.BoxGeometry(4, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0x101010 })
    );
    wheel.position.z = z;

    wheel.receiveShadow = true;
    wheel.castShadow = true;

    return wheel;
  }

  randomCarColor(colors) {
    let random = Math.floor(Math.random() * 4);
    return colors[random];
  }

  keyUp(e, car, cp) {
    if (e.keyCode === 37) {
      this.left(car, cp);
    }
    if (e.keyCode === 39) {
      this.right(car, cp);
    }
  }

  left(car, cp) {
    if (this.keyUpEvents) {
      const currentPosition = cp;
      let leftIterval = setInterval(() => {
        if (car.position.x > currentPosition - 4 && car.position.x > -4) {
          car.position.x -= 0.25;
        } else {
          clearInterval(leftIterval);
        }
      }, 5);
    }
  }

  right(car, cp) {
    if (this.keyUpEvents) {
      const currentPosition = cp;
      let rightIterval = setInterval(() => {
        if (car.position.x < currentPosition + 4 && car.position.x < 4) {
          car.position.x += 0.25;
        } else {
          clearInterval(rightIterval);
        }
      }, 5);
    }
  }

  enemyCar(cabinZ) {
    let enemyCar = this._car(cabinZ);
    let xPositions = [-4, 0, 4];
    enemyCar.position.set(
      xPositions[Math.floor(Math.random() * 3)],
      0.5,
      this.startPosition
    );
    return enemyCar;
  }

  setEnemyCar(car) {
    let enemyCar = car;
    let xPositions = [-4, 0, 4];
    enemyCar.position.set(
      xPositions[Math.floor(Math.random() * 3)],
      0.5,
      this.startPosition
    );
    enemyCar.children[0].material.color.setHex(
      this.randomCarColor(this.colors)
    );
  }

  moveEnemyCar(enemyCar) {
    let enemy = enemyCar;
    if (enemy.position.z > 20 && !this.collusion) {
      enemy.position.z = this.startPosition;
      this.setEnemyCar(enemy);
    }
    if (!this.collusion) {
      enemy.position.z += this.velocity;
    }
  }

  // Enviroment

  _enviroment() {
    let enviroment = new THREE.Group();
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 100),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: 0x606060,
      })
    );
    road.receiveShadow = true;
    enviroment.add(road);
    road.rotation.x = Math.PI / 2;

    const grassR = this._grass(14, 0.2, 0);

    enviroment.add(grassR);
    const grassL = this._grass(-14, 0.2, 0);

    enviroment.add(grassL);

    return enviroment;
  }

  _grass(x, y, z) {
    const grass = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.4, 100),
      new THREE.MeshStandardMaterial({ color: 0x4d890d })
    );

    grass.position.set(x, y, z);

    grass.receiveShadow = true;
    grass.castShadow = true;

    return grass;
  }

  _collusion(c, eC) {
    let car = c.position;
    let enemyCar = eC.position;

    if (
      car.x === enemyCar.x &&
      car.z + 3.5 > enemyCar.z + 3.5 &&
      car.z - 3.5 < enemyCar.z + 3.5
    ) {
      this.collusion = true;
      this.keyUpEvents = false;
      this.gameStarted = false;
      document.querySelector(".start").classList.remove("disable");
      game.resetScore();
      document.querySelector(".controls").classList.remove("active");
    }
    if (
      car.x === enemyCar.x &&
      car.z - 3.5 < enemyCar.z - 3.5 &&
      car.z + 3.5 > enemyCar.z - 3.5
    ) {
      this.collusion = true;
      this.keyUpEvents = false;
      this.gameStarted = false;
      document.querySelector(".start").classList.remove("disable");
      game.resetScore();
      document.querySelector(".controls").classList.remove("active");
    }

    this._score(c, eC);
  }

  _score(c, eC) {
    let car = c.position;
    let enemyCar = eC.position;

    if (enemyCar.z > 20 && !this.collusion) {
      this.score += this.scoreValue;
      document.querySelector(".score").innerHTML = this.score;
    }
  }

  resetScore() {
    this.score = 0;
    document.querySelector(".score").innerHTML = this.score;
  }
}
