document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const messageDisplay = document.getElementById('message-display');
    const startGameSection = document.getElementById('start-game-section');
    const gamePlaySection = document.getElementById('game-play-section');

    const numPilesInput = document.getElementById('num-piles');
    const pileSizeInputsContainer = document.getElementById('pile-size-inputs');
    const startGameBtn = document.getElementById('start-game-btn');

    const currentPlayerSpan = document.getElementById('current-player');
    const pilesDisplay = document.getElementById('piles-display');
    const movePileIndexInput = document.getElementById('move-pile-index');
    const moveNumberToRemoveInput = document.getElementById('move-number-to-remove');
    const makeMoveBtn = document.getElementById('make-move-btn');
    const computerMoveBtn = document.getElementById('computer-move-btn');
    const undoMoveBtn = document.getElementById('undo-move-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const quitGameBtn = document.getElementById('quit-game-btn');

    const customModal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // --- Global State Variables ---
    let currentPiles = [];
    let currentPlayer = 1;
    let isGameOver = false;
    let winner = -1;
    let initialPilesForRestart = []; // To store initial piles for the restart game option

    // --- Utility Functions ---

    /**
     * Displays a custom modal with a message and optional confirmation buttons.
     * @param {string} message - The message to display in the modal.
     * @param {boolean} [isConfirm=false] - If true, shows OK and Cancel buttons. Otherwise, only OK.
     * @param {function} [onConfirm=null] - Callback function to execute if OK is clicked in a confirm modal.
     */
    function showModal(message, isConfirm = false, onConfirm = null) {
        modalMessage.textContent = message;
        modalOkBtn.onclick = () => {
            hideModal();
            if (isConfirm && onConfirm) {
                onConfirm();
            }
        };
        if (isConfirm) {
            modalCancelBtn.classList.remove('hidden');
            modalCancelBtn.onclick = hideModal;
        } else {
            modalCancelBtn.classList.add('hidden');
        }
        customModal.classList.remove('hidden');
    }

    /**
     * Hides the custom modal.
     */
    function hideModal() {
        customModal.classList.add('hidden');
    }

    /**
     * Displays a message in the designated message display area.
     * @param {string} message - The message to display.
     * @param {string} type - 'info', 'success', 'error', 'warning' for styling.
     */
    function displayMessage(message, type = 'info') {
        messageDisplay.textContent = message;
        // Reset colors
        messageDisplay.classList.remove('text-blue-300', 'text-green-400', 'text-red-400', 'text-yellow-400');
        // Apply type-specific colors
        if (type === 'info') messageDisplay.classList.add('text-blue-300');
        else if (type === 'success') messageDisplay.classList.add('text-green-400');
        else if (type === 'error') messageDisplay.classList.add('text-red-400');
        else if (type === 'warning') messageDisplay.classList.add('text-yellow-400');
    }

    /**
     * Dynamically generates input fields for pile sizes based on the number of piles.
     */
    function generatePileSizeInputs() {
        const numPiles = parseInt(numPilesInput.value);
        pileSizeInputsContainer.innerHTML = ''; // Clear existing inputs

        if (isNaN(numPiles) || numPiles < 2) {
            displayMessage("Please enter at least 2 piles.", 'warning');
            return;
        }

        for (let i = 0; i < numPiles; i++) {
            const div = document.createElement('div');
            div.className = 'flex flex-col space-y-3';
            div.innerHTML = `
                <label for="pile-size-${i}" class="text-md">Size of Pile ${i + 1}:</label>
                <input type="number" id="pile-size-${i}" min="1" value="1"
                       class="p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400">
            `;
            pileSizeInputsContainer.appendChild(div);
        }
    }

    /**
     * Fetches the current game state from the backend and updates the UI.
     */
    async function updateGameUI() {
        try {
            const response = await fetch('/get_game_state');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            currentPiles = data.piles;
            currentPlayer = data.player;
            isGameOver = data.is_game_over;
            winner = data.winner;

            // Update current player display
            currentPlayerSpan.textContent = currentPlayer;

            // Render piles
            pilesDisplay.innerHTML = ''; // Clear existing piles
            if (currentPiles.length === 0 && !isGameOver) {
                // This state should ideally not happen unless game is over but not yet registered as such
                displayMessage("No piles to display. Game might be over or not started.", 'info');
            } else if (currentPiles.length === 0 && isGameOver) {
                // Game is truly over
                displayMessage(`🎉 Game Over! Player ${winner} wins! 🎉`, 'success');
            } else {
                currentPiles.forEach((size, index) => {
                    const pileDiv = document.createElement('div');
                    pileDiv.className = 'pile-item'; // Apply custom CSS class
                    pileDiv.innerHTML = `Pile ${index + 1}: <span class="text-green-300">${size}</span> objects`;
                    pilesDisplay.appendChild(pileDiv);
                });
                if (!isGameOver) {
                    displayMessage(`Player ${currentPlayer}'s turn. Make your move!`, 'info');
                }
            }

            // Enable/disable action buttons based on game state
            const actionButtons = [makeMoveBtn, computerMoveBtn, undoMoveBtn, restartGameBtn];
            actionButtons.forEach(btn => {
                btn.disabled = isGameOver;
                btn.classList.toggle('opacity-50', isGameOver);
                btn.classList.toggle('cursor-not-allowed', isGameOver);
            });
            // Specific case for undo: only enable if history exists (backend handles this, but UI can reflect)
            // For simplicity, we'll rely on backend response for undo success/failure

            // Ensure move inputs are cleared and enabled/disabled appropriately
            movePileIndexInput.value = '';
            moveNumberToRemoveInput.value = '';
            movePileIndexInput.disabled = isGameOver;
            moveNumberToRemoveInput.disabled = isGameOver;

        } catch (error) {
            console.error('Error fetching game state:', error);
            displayMessage('Error fetching game state. Please try again.', 'error');
        }
    }

    // --- Event Handlers ---

    numPilesInput.addEventListener('input', generatePileSizeInputs);

    startGameBtn.addEventListener('click', async () => {
        const numPiles = parseInt(numPilesInput.value);
        if (isNaN(numPiles) || numPiles < 2) {
            showModal("Please enter a valid number of piles (at least 2).", false);
            return;
        }

        const initialPiles = [];
        for (let i = 0; i < numPiles; i++) {
            const pileSizeInput = document.getElementById(`pile-size-${i}`);
            const pileSize = parseInt(pileSizeInput.value);
            if (isNaN(pileSize) || pileSize <= 0) {
                showModal(`Please enter a positive integer for Pile ${i + 1} size.`, false);
                return;
            }
            initialPiles.push(pileSize);
        }

        try {
            const response = await fetch('/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(initialPiles) // FastAPI expects JSON array directly
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to start game: ${errorText}`);
            }

            const success = await response.json(); // FastAPI returns bool directly
            if (success) {
                startGameSection.classList.add('hidden');
                gamePlaySection.classList.remove('hidden');
                displayMessage("Game started! Player 1's turn.", 'success');
                // Fetch initial piles for restart option
                const initialPilesResponse = await fetch('/get_initial_piles_for_restart');
                if (initialPilesResponse.ok) {
                    const data = await initialPilesResponse.json();
                    initialPilesForRestart = data.initial_piles;
                } else {
                    console.warn("Could not fetch initial piles for restart.");
                    initialPilesForRestart = []; // Reset if fetch fails
                }
                updateGameUI();
            } else {
                showModal("Failed to start game with provided piles. Ensure valid input.", false);
            }
        } catch (error) {
            console.error('Error starting game:', error);
            showModal(`Error starting game: ${error.message}`, false);
        }
    });

    makeMoveBtn.addEventListener('click', async () => {
        if (isGameOver) {
            showModal("Game is over. Start a new game or restart.", false);
            return;
        }

        const pileIndex = parseInt(movePileIndexInput.value);
        const numberToRemove = parseInt(moveNumberToRemoveInput.value);

        // Client-side validation for better UX
        if (isNaN(pileIndex) || pileIndex < 1 || pileIndex > currentPiles.length) {
            showModal("Please enter a valid pile number.", false);
            return;
        }
        const actualPileIndex = pileIndex - 1; // Convert to 0-based index

        if (isNaN(numberToRemove) || numberToRemove <= 0) {
            showModal("Please enter a positive number of objects to remove.", false);
            return;
        }

        if (currentPiles[actualPileIndex] === undefined || numberToRemove > currentPiles[actualPileIndex]) {
            showModal("Invalid move: Not enough objects in the selected pile or pile does not exist.", false);
            return;
        }

        try {
            const response = await fetch(`/remove?pile_index=${actualPileIndex}&number_to_remove=${numberToRemove}`, {
                method: 'POST'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to make move: ${errorText}`);
            }

            const success = await response.json();
            if (success) {
                displayMessage(`Player ${3 - currentPlayer}'s move successful.`, 'success');
                updateGameUI();
            } else {
                showModal("Invalid move. Please check pile number and objects to remove.", false);
            }
        } catch (error) {
            console.error('Error making move:', error);
            showModal(`Error making move: ${error.message}`, false);
        }
    });

    computerMoveBtn.addEventListener('click', async () => {
        if (isGameOver) {
            showModal("Game is over. Start a new game or restart.", false);
            return;
        }
        displayMessage("Computer is thinking...", 'info');

        try {
            const optimalMoveResponse = await fetch('/find_optimal_move');
            if (!optimalMoveResponse.ok) {
                throw new Error(`Failed to get computer move: ${optimalMoveResponse.status}`);
            }
            const move = await optimalMoveResponse.json(); // move will be [pile_index, number_to_remove] or null

            if (move && move[0] !== null) { // Check if move is not null and first element is not null
                const [pileIndex, numberToRemove] = move;
                const removeResponse = await fetch(`/remove?pile_index=${pileIndex}&number_to_remove=${numberToRemove}`, {
                    method: 'POST'
                });

                if (!removeResponse.ok) {
                    const errorText = await removeResponse.text();
                    throw new Error(`Computer failed to make move: ${errorText}`);
                }

                const success = await removeResponse.json();
                if (success) {
                    displayMessage(`Computer removed ${numberToRemove} from Pile ${pileIndex + 1}.`, 'success');
                    updateGameUI();
                } else {
                    showModal("Computer attempted an invalid move. This indicates an issue with the AI logic.", false);
                }
            } else {
                // This case happens if find_optimal_move returns None (e.g., game already over)
                showModal("Computer cannot make a move. Game might be over or in an unexpected state.", false);
                updateGameUI(); // Update UI to reflect game over if it is
            }
        } catch (error) {
            console.error('Error with computer move:', error);
            showModal(`Error with computer move: ${error.message}`, false);
        }
    });

    undoMoveBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/undo_move', {
                method: 'POST'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to undo move: ${errorText}`);
            }
            const success = await response.json();
            if (success) {
                displayMessage("Last move undone.", 'info');
                updateGameUI();
            } else {
                showModal("No moves to undo.", false);
            }
        } catch (error) {
            console.error('Error undoing move:', error);
            showModal(`Error undoing move: ${error.message}`, false);
        }
    });

    restartGameBtn.addEventListener('click', async () => {
        if (initialPilesForRestart.length === 0) {
            showModal("No initial game state found to restart. Please start a new game.", false);
            return;
        }

        showModal("Are you sure you want to restart the current game?", true, async () => {
            try {
                const response = await fetch('/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(initialPilesForRestart)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to restart game: ${errorText}`);
                }

                const success = await response.json();
                if (success) {
                    displayMessage("Game restarted with original piles!", 'success');
                    updateGameUI();
                } else {
                    showModal("Failed to restart game.", false);
                }
            } catch (error) {
                console.error('Error restarting game:', error);
                showModal(`Error restarting game: ${error.message}`, false);
            }
        });
    });

    newGameBtn.addEventListener('click', () => {
        showModal("Are you sure you want to start a new game? Current game progress will be lost.", true, () => {
            startGameSection.classList.remove('hidden');
            gamePlaySection.classList.add('hidden');
            numPilesInput.value = '2'; // Reset to default
            generatePileSizeInputs(); // Regenerate default pile inputs
            displayMessage("Welcome to Nim! Start a new game.", 'info');
            // Clear any previous game state indicators
            currentPiles = [];
            currentPlayer = 1;
            isGameOver = false;
            winner = -1;
            initialPilesForRestart = [];
        });
    });

    quitGameBtn.addEventListener('click', () => {
        showModal("Are you sure you want to quit the program?", true, () => {
            displayMessage("Thanks for playing! Goodbye.", 'info');
            // In a real browser environment, you might close the window/tab.
            // For this local server setup, it just stops interaction.
            // alert("You can now close this tab/window."); // Using custom modal instead of alert
            showModal("You can now close this tab/window.", false);
        });
    });

    // --- Initial Setup ---
    generatePileSizeInputs(); // Generate initial pile size inputs on load
});
