class Player {
    constructor(type, name) {
        this.name = name;
        this.identity = type // identidade 1 ou identidade 2
        this.score = 0;
        this.hp = 10;
        this.movementSpeed = 5;
        this.lives = 1;
        this.width = 20;
        this.height = 40;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 - 10;
        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
        this.attack = {
            damage: 1,
            speed: 5,
            ammount: 1,
            range: 200,
            current: [],
            radius: 3,
        }
        // Para o som
        this.laserSound = new Som(document.querySelector("#laserSound"));
        // Para o sprite
        this.image = type == 1 ? document.querySelector('#identity1Sprite') : document.querySelector('#identity2Sprite')
        this.frames = 10
        this.index = 1
        this.counter = 0
        this.iterations = 16
    }

    // MOVIMENTOS
    movement() {
        for (let key in game.keyMap) {
            game.keyMap[key] && this.doMovement(key) // Se true, chama doMovement(key)
        }
    }

    doMovement(keyCode) {
        switch (keyCode) {
            case '27': // Esc, abre o meu de pausa
                openMenuPaused()
                break
            case '37': // Seta esquerda ←, tiros para a esquerda
                this.fireLeft();
                break;
            case '38': // Seta para cima ↑, tiros para cima
                this.fireUp();
                break;
            case '39': // Seta para a direita →, tiros para a direita
                this.fireRight();
                break;
            case '40': // Seta para baixo ↓, tiros para baixo
                this.fireDown();
                break;
            case '65': // Letra A, andar para a esquerda
                if (game.isInsideMap('moveLeft', this.x, this.y, this.width, this.height)) {
                    this.moveLeft();
                }
                break;
            case '87': // Letra W, andara para cima
                if (game.isInsideMap('moveUp', this.x, this.y, this.width, this.height)) {
                    this.moveUp();
                }
                break;
            case '68': // Letra D, andar para a direita
                if (game.isInsideMap('moveRight', this.x, this.y, this.width, this.height)) {
                    this.moveRight();
                }
                break;
            case '83': // Letra S, andar para baixo
                if (game.isInsideMap('moveDown', this.x, this.y, this.width, this.height)) {
                    this.moveDown();
                }
                break;
            default:
                return;
        }
    }

    moveUp() {
        this.y -= this.movementSpeed;
        this.setCenter();
    }

    moveDown() {
        this.y += this.movementSpeed;
        this.setCenter();
    }

    moveLeft() {
        this.x -= this.movementSpeed;
        this.setCenter();
    }

    moveRight() {
        this.x += this.movementSpeed;
        this.setCenter();
    }

    setCenter() {
        this.center.x = this.x + this.width / 2;
        this.center.y = this.y + this.height / 2;
        return;
    }
    // FIM MOVIMENTOS

    // TIROS
    fireUp() {
        if (this.attack.current.length < this.attack.ammount) {
            this.attack.current.push({
                direction: 'UP',
                x: this.center.x,
                y: this.center.y,
                initialX: this.center.x,
                initialY: this.center.y
            })

            this.laserSound.reproduz(true)
        }
    }

    fireDown() {
        if (this.attack.current.length < this.attack.ammount) {
            this.attack.current.push({
                direction: 'DOWN',
                x: this.center.x,
                y: this.center.y,
                initialX: this.center.x,
                initialY: this.center.y
            })

            this.laserSound.reproduz(true)
        }
    }

    fireLeft() {
        if (this.attack.current.length < this.attack.ammount) {
            this.attack.current.push({
                direction: 'LEFT',
                x: this.center.x,
                y: this.center.y,
                initialX: this.center.x,
                initialY: this.center.y
            })

            this.laserSound.reproduz(true)
        }
    }

    fireRight() {
        if (this.attack.current.length < this.attack.ammount) {
            this.attack.current.push({
                direction: 'RIGHT',
                x: this.center.x,
                y: this.center.y,
                initialX: this.center.x,
                initialY: this.center.y
            })

            this.laserSound.reproduz(true)
        }
    }

    draw() {
        context.drawImage(this.image, this.image.width / this.frames * this.index, 0, this.image.width / this.frames, this.image.height, this.x, this.y, this.width, this.height)

        if (++this.counter % this.iterations == 0) {
            if (++this.index >= this.frames) {
            this.index = 0;
            }
        }
    }
}