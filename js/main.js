const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

/*Variables Canva*/
canvas.width = 448;
canvas.height = 700;

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')

/* BALL FUNCTIONS*/
/*Variables Pelota*/
const ballRadius = 5;

//Posicion de la Pelota
let x = canvas.width / 2;
let y = canvas.height - 30;

//Velocidad Pelota
let dx = -2;
let dy = -2;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function ballMovement() {
    //Rebotar la pelota en los laterales
    if (
        x + dx > canvas.width - ballRadius ||
        x + dx < ballRadius
    ) {
        dx = -dx;
    }

    //Rebotar la pelota en el techo
    if (y + dy < ballRadius) {
        dy = -dy;
    }

    //La pelota toca la pala
    const isBallSameXAsPaddle =
        x > paddleX &&
        x < paddleX + paddleWidth

    const isBallTouchingPaddle =
        y + dy > paddleY

    if (isBallTouchingPaddle && isBallSameXAsPaddle) {
        dy = -dy
    }


    //Si toca el suelo
    if (y + dy > canvas.height - ballRadius) {
        console.log('has perdido');
        document.location.reload()
    }

    //Mover la Pelota
    x += dx;
    y += dy;
}

//VARIABLES DE PADDLE
const paddleHeight = 10;
const paddleWidth = 50;


/*PADDLE FUNCTIONS*/
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

const PADDLE_SENSITIVITY = 5;

function drawPaddle() {
    ctx.drawImage(
        $sprite, //IMAGEN
        29, //CORDENADA DE RECORTE X
        172, //CORDENADAS DEL RECORTE Y
        paddleWidth, //EL ANCHO DEL RECORTE
        paddleHeight, //EL ALTO DEL RECORTE
        paddleX, //POSICION DE X
        paddleY, //POSICION DE Y
        paddleWidth, //ANCHO DEL DIBUJO
        paddleHeight, //ALTO DEL DIBUJO
    )
}

function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SENSITIVITY;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SENSITIVITY;
    }
}

/* BRICKS */
const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 1;
const brickOffsetTop = 80;
const brickOffsetLeft = 12;
const bricks = [];

const BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
}

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        //Se calcula la posicion del ladrillo en la pantalla
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        //Asignar un color aleatorio a cada ladrillo
        const random = Math.floor(Math.random() * 8)
        bricks[c][r] = {
            x: brickX,
            y: brickY,
            status: BRICK_STATUS.ACTIVE,
            color: random
        }
    }
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status === BRICK_STATUS.DESTROYED)
                continue;

            const clipX = currentBrick.color * 32;
            ctx.drawImage(
                $bricks,
                clipX,
                0,
                brickWidth,
                brickHeight,
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            )
        }
    }
}

//COLISIONES
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {

        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r];
            if (currentBrick.status === BRICK_STATUS.DESTROYED)
                continue;
            const isBallSameXAsBrick =
                x > currentBrick.x &&
                x < currentBrick.x + brickWidth
            const isBallSameYAsBrick =
                y > currentBrick.y &&
                y < currentBrick.y + brickHeight

            if(isBallSameXAsBrick && isBallSameYAsBrick){
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }
    }
}

//CANVAS FUNCTIONS
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const {
            key
        } = event;
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = true;
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = true;
        }
    }

    function keyUpHandler(event) {
        const {
            key
        } = event;
        if (key === 'Right' || key === 'ArrowRight') {
            rightPressed = false;
        } else if (key === 'Left' || key === 'ArrowLeft') {
            leftPressed = false;
        }
    }
}

function draw() {
    //Se limpian los elementos
    clearCanvas()

    //Dibujar Elementos
    drawBall();
    drawPaddle();
    drawBricks();
    //drawScore();

    //Colisiones y Movimientos
    ballMovement()
    paddleMovement()
    collisionDetection()

    window.requestAnimationFrame(draw)
}

draw();
initEvents();
