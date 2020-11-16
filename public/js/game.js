
const canvas = document.querySelector('canvas')

const {innerHeight, innerWidth} = window

canvas.width = 600
canvas.height = 600

const ctx = canvas.getContext('2d')

const shots = []

class Alien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.h = 50;
    this.w = 50;
    this.color = '#9f0'
  }

  render() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }
  update(dir) {
    this.x += dir * 0.5;
    // setInterval(() => this.shoot, 3000)
  }

  shoot(shots) {
    shots.push(new Shot(this.x + this.w, this.y + this.h, 1))
  }
}

class Shot {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.h = 20;
    this.w = 4;
    this.color = '#ff0'
    this.dir = dir
  }

  render() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h)
  }
  update() {
    this.y += 10* this.dir;
  }

  collidesWith(obj) {
    return (this.x < obj.x + obj.w &&
      this.x + this.w > obj.x &&
      this.y < obj.y + obj.h &&
      this.y + this.h > obj.y)
  }
}

class Ship {
  constructor(x, y) {
  this.x = x
  this.y = y
  this.w = 25
  this.h = 25
  this.dir = 0
  this.speed = 10
  this.color = "#fff"
  }

  render() {
    ctx.fillStyle = "#a0a0a0"
    ctx.fillRect(this.x, this.y, this.w, this.h)
  }

  update() {
    if (this.x <= 0 && this.dir < 0) return;
    if (this.x + this.w >= canvas.width && this.dir > 0) return;

    this.x += this.dir * this.speed
  }

  shoot(shots) {
    shoots.push(new Shot(this.x + this.w/2, this.y, -1))
  }
}

const ship = new Ship(canvas.width / 2 - 12.5, canvas.height - 50)

const aliens = []
const shoots = []
let aliensDir = 1;


function generateAliens() {
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 5; j++) {
      aliens.push( new Alien(j * 103 + (600 / 5 - 50), i * 80 + 40))
    }
  }
}

const keyboardDownActions = {
  ArrowLeft: () => ship.dir = -1,
  ArrowRight: () => ship.dir = 1,
}


document.addEventListener('keydown', (ev) => {
  if (keyboardDownActions[ev.code]) {
    keyboardDownActions[ev.code]()
  }
})

document.addEventListener('keyup', function (ev) {
  switch (ev.code) {
    case 'Space':
      ship.shoot(shots)
      break
    case 'ArrowLeft':
    case 'ArrowRight':
      ship.dir = 0
      break
  }
})


generateAliens()


function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  shoots.forEach((shoot, shootIndex) => {
    shoot.render();
    shoot.update();

    if (shoot.y + shoot.h < 0) {
      shoots.splice(shootIndex, 1);
    }

    aliens.forEach((alien, alienIndex) => {
      if (shoot.collidesWith(alien)) {
        aliens.splice(alienIndex, 1)
        shoots.splice(shootIndex, 1)
      }
    })
  })

  if (aliens.length > 0) {
    if (aliens[0].x <= 0) {
      aliensDir = 1
    } else if (aliens.length >= 5 ) {
      if (aliens[4].x + aliens[4].w >= 600) {
        aliensDir= -1;
      }
    } else {
      if (aliens[aliens.length - 1].x + aliens[aliens.length -1].w >= 600) {
        aliensDir = -1
      }
    }
  }
    
  aliens.forEach((alien, alienIndex) => {
    alien.render();

    alien.update(aliensDir);

  })
  
  ship.render()
  ship.update()
  
  requestAnimationFrame(render)
}

render()


