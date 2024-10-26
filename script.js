// Snake Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let gameInterval; // Variable to store the interval ID
let isGameOver = false; // Flag to track game over state

// Game speed in milliseconds (125ms for twice the speed of 250ms)
const GAME_SPEED = 125;

(function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation(snake); // Pass snake to ensure fruit doesn't spawn on it

    startLoop(); // Start the game loop

    window.addEventListener('keydown', handleKeyDown);
}());

// Function to start the game loop
function startLoop() {
    // Prevent multiple intervals
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    gameInterval = window.setInterval(gameLoop, GAME_SPEED);
}

// Function to stop the game loop
function stopLoop() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

// The main game loop function
function gameLoop() {
    if (isGameOver) return; // Do nothing if the game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruit.draw();
    snake.update();
    snake.draw();

    if (snake.eat(fruit)) {
        fruit.pickLocation(snake); // Pass snake to prevent overlapping
    }

    snake.checkCollision();
    document.getElementById('score').innerHTML = `Score: ${snake.total}`;
}

function handleKeyDown(evt) {
    if (!isGameOver) { // Only allow direction changes if the game is not over
        const direction = evt.key.toLowerCase();
        snake.changeDirection(direction);
    }
}

function Snake() {
    this.x = scale * Math.floor(columns / 2);
    this.y = scale * Math.floor(rows / 2);
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#FFFFFF";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    }

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        if (this.total > 0) {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Wrap around the canvas
        if (this.x >= canvas.width) {
            this.x = 0;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    }

    this.changeDirection = function(direction) {
        // Prevent the snake from reversing
        switch(direction) {
            case 'w':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 's':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'a':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'd':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    }

    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }

        return false;
    }

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.reset();
                break;
            }
        }
    }

    this.reset = function() {
        // Removed this.total = 0; to preserve the score
        this.tail = [];
        isGameOver = true;
        document.getElementById('gameOver').classList.remove('hidden');

        // Update the score display to reflect the final score
        document.getElementById('score').innerHTML = `Score: ${this.total}`;

        stopLoop(); // Stop the game loop when game is over
    }
}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function(snake) {
        let validLocation = false;
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loops

        while (!validLocation && attempts < maxAttempts) {
            this.x = (Math.floor(Math.random() * (columns - 1)) + 1) * scale;
            this.y = (Math.floor(Math.random() * (rows - 1)) + 1) * scale;

            // Check if the new position overlaps with the snake's head or tail
            let collision = false;

            // Check collision with head
            if (this.x === snake.x && this.y === snake.y) {
                collision = true;
            }

            // Check collision with tail
            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x === snake.tail[i].x && this.y === snake.tail[i].y) {
                    collision = true;
                    break;
                }
            }

            if (!collision) {
                validLocation = true;
            }

            attempts++;
        }

        if (!validLocation) {
            // If a valid location wasn't found, handle accordingly
            // For example, you can set the game as won
            alert("Congratulations! You've won the game!");
            this.x = -scale; // Move fruit off-canvas
            this.y = -scale;
            stopLoop();
        }
    }

    this.draw = function() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

// Toggle game visibility
const toggleButton = document.getElementById('toggleGame');
const gameSection = document.getElementById('gameSection');

toggleButton.addEventListener('click', () => {
    const isHidden = gameSection.classList.toggle('hidden');
    gameSection.classList.toggle('fade-in');
    toggleButton.textContent = isHidden ? 'Play Snake Game' : 'Hide Snake Game';

    if (isHidden) {
        // Game is now hidden; stop the game loop
        stopLoop();
    } else {
        // Game is now visible; start the game loop if not game over
        if (!isGameOver) {
            startLoop();
        }
    }
});

// Restart game
document.getElementById('restartGame').addEventListener('click', () => {
    snake = new Snake();
    fruit.pickLocation(snake); // Pass snake to ensure fruit doesn't spawn on it
    isGameOver = false;
    document.getElementById('gameOver').classList.add('hidden');
    
    // Reset the score display to 0
    document.getElementById('score').innerHTML = `Score: ${snake.total}`;

    // If the game is visible, start the loop
    if (!gameSection.classList.contains('hidden')) {
        startLoop();
    }
});
