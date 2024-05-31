// Assisted by ChatGPT, an AI language model by OpenAI.

// Variables to track game state
let currentPlayer = 1;
let selectedShape = null;
let selectedShapeElement = null;

// Function to initialize event listeners
function initializeListeners() {
    // Add click listeners to staging area cells
    document.querySelectorAll('.staging-cell').forEach(cell => {
        cell.addEventListener('click', selectShape);
    });

    // Add click listeners to playing field cells
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', placeShape);
    });

    // Add click listener to info icon
    document.getElementById('info-icon').addEventListener('click', showOverlay);

    // Add click listener to close overlay
    document.getElementById('close-overlay').addEventListener('click', closeOverlay);
}

// Function to select a shape from the staging area
function selectShape(event) {
    if (selectedShape) {
        // Remove shape from the cell in the playing field if exists
        const previouslyPlacedCell = document.querySelector('.selected-shape');
        if (previouslyPlacedCell) {
            previouslyPlacedCell.className = 'cell';
            previouslyPlacedCell.innerHTML = '';
        }

        // Return previously selected shape to staging area
        selectedShapeElement.classList.remove('selected');
        selectedShapeElement.style.visibility = 'visible';
    }

    // Mark the selected shape and update info window
    selectedShapeElement = event.target;
    selectedShape = selectedShapeElement.className.split(' ')[1];
    selectedShapeElement.classList.add('selected');
    
    // Clone the selected shape and display it in the info window
    const clonedShape = selectedShapeElement.cloneNode(true);
    clonedShape.classList.remove('selected');
    updateInfoWindow(`Where on the board would you like to place this shape?`, clonedShape);

    selectedShapeElement.style.visibility = 'hidden';
}


// Function to place a shape on the playing field
function placeShape(event) {
    if (selectedShape) {
        // Find the previously selected cell and clear its contents
        const previouslySelectedCell = document.querySelector('.selected-shape');
        if (previouslySelectedCell) {
            previouslySelectedCell.className = 'cell';
            previouslySelectedCell.innerHTML = '';
        }

        // Clone the shape and place it in the selected cell
        event.target.className = `cell ${selectedShape}`;
        const clonedShape = selectedShapeElement.cloneNode(true);
        clonedShape.classList.remove('selected');
        clonedShape.style.visibility = 'visible';

        // Add a star to the center of the shape
        const star = document.createElement('div');
        star.className = 'star';
        clonedShape.appendChild(star);

        event.target.innerHTML = '';
        event.target.appendChild(clonedShape);
        event.target.classList.add('selected-shape');

        // Show confirm button
        updateInfoWindow(`<button id="confirm-placement">Confirm the correct placement of the shape</button>`);

        // Add event listener to confirm button
        document.getElementById('confirm-placement').addEventListener('click', confirmPlacement);
    }
}

// Function to confirm shape placement
function confirmPlacement() {
    // Remove selected shape from staging area
    selectedShapeElement.classList.remove('selected');

    // Remove highlight and star from the placed shape
    const placedShape = document.querySelector('.selected-shape');
    placedShape.classList.remove('selected-shape');
    const star = placedShape.querySelector('.star');
    if (star) {
        star.remove();
    }

    // Check for win condition
    if (checkWinCondition()) {
        updateInfoWindow(`Player ${currentPlayer} wins! <button id="play-again">Play Again</button>`);
        document.getElementById('play-again').addEventListener('click', resetGame);
    } else {
        // Switch player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateInfoWindow(`Player ${currentPlayer}, please select your next shape.`);
    }

    // Reset selected shape variables
    selectedShape = null;
    selectedShapeElement = null;
}

// Function to check win condition
function checkWinCondition() {
    // Retrieve the state of the playing field
    const cells = document.querySelectorAll('.cell');
    const grid = Array.from(cells).map(cell => cell.className.split(' ')[1] || '');

    // Define winning patterns
    const winningPatterns = [
        [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // Rows
        [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // Columns
        [0, 5, 10, 15], [3, 6, 9, 12] // Diagonals
    ];

    // Function to check if all elements in an array are the same or all different
    function allSameOrDifferent(arr) {
        const uniqueShapes = new Set(arr);
        return uniqueShapes.size === 1 || uniqueShapes.size === arr.length;
    }

    // Check each winning pattern
    for (let pattern of winningPatterns) {
        const shapes = pattern.map(index => grid[index]);
        // Ensure all cells in the pattern are filled
        if (shapes.every(shape => shape !== '') && allSameOrDifferent(shapes)) {
            return true;
        }
    }

    return false;
}

// Function to reset the game
function resetGame() {
    // Reset game state and UI
    currentPlayer = 1;
    selectedShape = null;
    selectedShapeElement = null;

    document.querySelectorAll('.cell').forEach(cell => {
        cell.className = 'cell';
        cell.innerHTML = '';
    });

    document.querySelectorAll('.staging-cell').forEach(cell => {
        cell.style.visibility = 'visible';
        cell.classList.remove('selected');
    });

    updateInfoWindow(`Welcome to Carsten's Cube!<br>Player 1, please select your first shape.`);
}

// Function to update the information window
function updateInfoWindow(content, shapeElement = null) {
    const infoText = document.getElementById('info-text');
    infoText.innerHTML = content;

    if (shapeElement) {
        infoText.appendChild(shapeElement);
    }
}

// Function to show the rules overlay
function showOverlay() {
    document.getElementById('overlay').style.display = 'flex';
}

// Function to close the rules overlay
function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

// Initialize event listeners on page load
window.onload = initializeListeners;
