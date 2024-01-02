document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const container = document.getElementById("gameContainer");
    const startButton = document.getElementById("startButton");
    const gameOver = document.getElementById("gameOver");
    const bounceCounterElement = document.getElementById("bounceCounter");

    canvas.width = 800; // Adjusted canvas width
    canvas.height = 600; // Adjusted canvas height

    const paddleWidth = 150; // Adjusted paddle width
    const paddleHeight = 30; // Adjusted paddle height
    const paddleRadius = 15; // Added paddle radius for rounded edges
    const ballRadius = 15; // Adjusted ball radius
    const ballSpeedMultiplier = 2; // Adjusted ball speed multiplier and paddle speed
    

    let paddleX = (canvas.width - paddleWidth) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - paddleHeight - ballRadius;
    let ballSpeedX = 2 * ballSpeedMultiplier; // Adjusted ball speed
    let ballSpeedY = -2 * ballSpeedMultiplier; // Adjusted ball speed
    let gameStarted = false;
    let gamePaused = false; // Added gamePaused variable
    let bounceCounter = 0;

    function drawPaddle() {
        ctx.beginPath();
        ctx.moveTo(paddleX + paddleRadius, canvas.height - paddleHeight);
        ctx.arcTo(
            paddleX + paddleWidth,
            canvas.height - paddleHeight,
            paddleX + paddleWidth,
            canvas.height,
            paddleRadius
        );
        ctx.arcTo(
            paddleX + paddleWidth,
            canvas.height,
            paddleX,
            canvas.height,
            paddleRadius
        );
        ctx.arcTo(
            paddleX,
            canvas.height,
            paddleX,
            canvas.height - paddleHeight,
            paddleRadius
        );
        ctx.arcTo(
            paddleX,
            canvas.height - paddleHeight,
            paddleX + paddleRadius,
            canvas.height - paddleHeight,
            paddleRadius
        );
        ctx.fillStyle = "#33fff6";
        ctx.fill();
        ctx.closePath();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff6def";
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPaddle();
        drawBall();

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Bounce off walls
        if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
            ballSpeedX = -ballSpeedX;
        }

        // Bounce off upper wall (only if game is started)
        if (gameStarted && ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Bounce off paddle
        if (
            ballY + ballRadius > canvas.height - paddleHeight &&
            ballX > paddleX &&
            ballX < paddleX + paddleWidth
        ) {
            ballSpeedY = -ballSpeedY;
            bounceCounter++;
            bounceCounterElement.textContent = `Bounces: ${bounceCounter}`;
        }

        // Game over if ball goes below paddle
        if (ballY + ballRadius > canvas.height) {
            gameStarted = false;
            gameOver.style.display = "block";
            startButton.textContent = "Restart";
        }

        if (gameStarted && !gamePaused) {
            requestAnimationFrame(draw);
        }
    }

    function keyDownHandler(e) {
        if (!gamePaused) {
            if (e.key === "Right" || e.key === "ArrowRight") {
                paddleX += 10 * ballSpeedMultiplier; // Adjusted paddle speed
            } else if (e.key === "Left" || e.key === "ArrowLeft") {
                paddleX -= 10 * ballSpeedMultiplier; // Adjusted paddle speed
            }

            // Ensure paddle stays within canvas boundaries
            paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX));
        }
    }

    function togglePause() {
        if (gameStarted) {
            gamePaused = !gamePaused;
            startButton.textContent = gamePaused ? "Resume" : "Pause";

            if (!gamePaused) {
                requestAnimationFrame(draw);
            }
        }
    }

    function startGame() {
        gameStarted = true;
        gameOver.style.display = "none";
        startButton.textContent = "Pause";
        bounceCounter = 0;
        bounceCounterElement.textContent = "Bounces: 0";
        paddleX = (canvas.width - paddleWidth) / 2;
        ballX = canvas.width / 2;
        ballY = canvas.height - paddleHeight - ballRadius;
        gamePaused = false; // Reset gamePaused when starting a new game
        requestAnimationFrame(draw);
    }

    function restartGame() {
        gameStarted = false;
        startButton.textContent = "Start";
        startGame();
    }

    startButton.addEventListener("click", function () {
        if (!gameStarted) {
            startGame();
        } else {
            togglePause(); // Toggle pause/resume instead of restarting immediately
        }
    });

    document.addEventListener("keydown", keyDownHandler);

    window.addEventListener("resize", function () {
        canvas.width = 800; // Adjusted canvas width
        canvas.height = 600; // Adjusted canvas height
        if (gameStarted) {
            startGame();
        }
    });
});
