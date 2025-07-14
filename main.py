class Game:
    """
    Represents a game of Nim, managing piles, players, and game state.
    """

    def __init__(self):
        self.piles = []
        self.player = 1  # Player 1 starts
        self.history = []  # Stores copies of piles before each move for undo functionality
        self.initial_piles = []  # Stores the initial configuration of piles for restarting the game

    def start(self, initial_piles):
        """
        Initializes a new game with the given pile sizes.

        Args:
            initial_piles (list): A list of integers representing the size of each pile.

        Returns:
            bool: True if the game started successfully, False otherwise.
        """
        # Validate initial_piles: must be a list, have at least two piles, and all piles must be positive integers.
        if not isinstance(initial_piles, list) or len(initial_piles) < 2:
            print("Error: A Nim game must start with at least two piles.")
            return False
        if not all(isinstance(p, int) and p > 0 for p in initial_piles):
            print("Error: All pile sizes must be positive integers.")
            return False

        self.initial_piles = list(initial_piles)  # Store a copy for restarting the game
        self.piles = list(initial_piles)  # Make a copy for the current game state
        self.player = 1  # Player 1 always starts a new game
        self.history = []  # Clear history for a new game
        print(f"Game started with piles: {self.piles}")
        return True

    def remove(self, pile_index, number_to_remove):
        """
        Removes 'number_to_remove' objects from the pile at 'pile_index'.
        This method also handles updating the game history and switching players.

        Args:
            pile_index (int): The 0-based index of the pile to remove from.
            number_to_remove (int): The number of objects to remove.

        Returns:
            bool: True if the move is valid and executed, False otherwise.
        """
        # Store a deep copy of the current piles before the move for undo functionality
        self.history.append(list(self.piles))

        # Validate the move: check if pile_index is valid and if number_to_remove is valid for that pile.
        if not (0 <= pile_index < len(self.piles) and
                0 < number_to_remove <= self.piles[pile_index]):
            # If the move is invalid, remove the history entry that was just added
            self.history.pop()
            return False

        self.piles[pile_index] -= number_to_remove
        if self.piles[pile_index] == 0:
            # If the pile becomes empty, remove it from the list of piles using pop by index
            self.piles.pop(pile_index)

        # Switch player only after a successful and valid move
        self.player = 3 - self.player  # Switches between 1 and 2 (1 -> 2, 2 -> 1)
        return True

    def undo_move(self):
        """
        Undoes the last move made, restoring the previous game state.

        Returns:
            bool: True if a move was successfully undone, False if no moves to undo.
        """
        if self.history:
            self.piles = self.history.pop()  # Restore piles from history
            self.player = 3 - self.player  # Switch player back to the one who made the undone move
            print("Last move undone.")
            return True
        print("No moves to undo.")
        return False

    def is_game_over(self):
        """
        Checks if the game has ended (i.e., no piles left).

        Returns:
            bool: True if the game is over, False otherwise.
        """
        return len(self.piles) == 0

    def get_winner(self):
        """
        Determines the winner of the game. In standard Nim, the player who makes the last move wins.

        Returns:
            int: The player number (1 or 2) if the game is over, otherwise -1.
        """
        if self.is_game_over():
            # If the game is over, the 'self.player' attribute has already switched to the *next* player.
            # Therefore, the winner is the player who *just moved* (the one whose turn it was previously).
            return 3 - self.player
        return -1

    def display_piles(self):
        """
        Prints the current state of the piles to the console.
        """
        if not self.piles:
            print("No piles left. Game over!")
            return
        print("\n--- Current Piles ---")
        for i, size in enumerate(self.piles):
            print(f"Pile {i + 1}: {size} objects")
        print("---------------------")

    def calculate_nim_sum(self):
        """
        Calculates the Nim-sum (XOR sum) of all current piles.
        The Nim-sum is a key concept in Nim theory for determining optimal moves.

        Returns:
            int: The Nim-sum of the current piles.
        """
        nim_sum = 0
        for pile_size in self.piles:
            nim_sum ^= pile_size
        return nim_sum

    def find_optimal_move(self):
        """
        Finds an optimal move for the computer based on the Nim-sum strategy.
        If the Nim-sum is non-zero, the computer makes a move to make it zero (winning position).
        If the Nim-sum is zero, the computer makes a non-optimal but valid move (e.g., remove 1 from the largest pile)
        as any move will lead to a non-zero Nim-sum state for the opponent.

        Returns:
            tuple: A tuple (pile_index, number_to_remove) representing the optimal move,
                   or None if there are no piles left (game over).
        """
        if not self.piles:
            return None  # No piles, no move possible

        current_nim_sum = self.calculate_nim_sum()

        if current_nim_sum == 0:
            # If Nim-sum is 0, any move will lead to a non-zero Nim-sum state for the opponent.
            # The computer makes a valid, non-optimal move. A simple strategy is to remove 1 from the largest pile.
            largest_pile_index = 0
            for i, size in enumerate(self.piles):
                if size > self.piles[largest_pile_index]:
                    largest_pile_index = i
            return largest_pile_index, 1  # Remove 1 from the largest pile

        # If Nim-sum is non-zero, find a move that makes the Nim-sum 0.
        for i, pile_size in enumerate(self.piles):
            # Target size for this pile after the move, such that (target_size XOR (current_nim_sum XOR pile_size)) == 0
            # Which simplifies to target_size == pile_size XOR current_nim_sum
            target_size = pile_size ^ current_nim_sum
            if target_size < pile_size:
                number_to_remove = pile_size - target_size
                return i, number_to_remove

        # This part should theoretically not be reached if current_nim_sum is non-zero and piles exist.
        return None


def get_integer_input(prompt, min_val=None, max_val=None):
    """
    Helper function to get validated integer input from the user.

    Args:
        prompt (str): The message to display to the user.
        min_val (int, optional): The minimum allowed integer value. Defaults to None.
        max_val (int, optional): The maximum allowed integer value. Defaults to None.

    Returns:
        int: The validated integer input.
    """
    while True:
        try:
            value = int(input(prompt))
            if min_val is not None and value < min_val:
                print(f"Please enter a value of at least {min_val}.")
            elif max_val is not None and value > max_val:
                print(f"Please enter a value of at most {max_val}.")
            else:
                return value
        except ValueError:
            print("Invalid input. Please enter an integer.")


def get_piles_input():
    """
    Prompts the user to enter the number of piles and the size of each pile.

    Returns:
        list: A list of integers representing the sizes of the piles.
    """
    while True:
        num_piles = get_integer_input("How many piles do you want to start with (at least 2)? ", min_val=2)
        piles = []
        for i in range(num_piles):
            pile_size = get_integer_input(f"Enter size for Pile {i + 1}: ", min_val=1)
            piles.append(pile_size)
        return piles


def main():
    """
    Main function to run the Nim Solver program.
    """
    print("Welcome to the Nim Solver!")
    game = Game()

    while True:
        print("\n--- Main Menu ---")
        print("1. Start a new game")
        print("2. Quit")
        main_choice = get_integer_input("Enter your choice: ", min_val=1, max_val=2)

        if main_choice == 2:
            print("Thanks for playing! Goodbye.")
            break  # Exit the main program loop
        elif main_choice == 1:
            initial_piles = get_piles_input()
            if not game.start(initial_piles):
                # If game.start returns False, it means input was invalid, so loop back to main menu
                continue

            game_active = True
            while game_active:
                game.display_piles()

                # Check for game over condition after displaying piles
                if game.is_game_over():
                    winner = game.get_winner()
                    print(f"🎉 Game Over! Player {winner} wins! 🎉")
                    break

                print(f"\n--- Player {game.player}'s turn ---")
                print("1. Make a move")
                print("2. Let the computer make a move")
                print("3. Undo last move")
                print("4. Restart current game")
                print("5. Start a new game (back to main menu)")
                print("6. Quit program")
                player_action_choice = get_integer_input("Enter your choice: ", min_val=1, max_val=6)

                if player_action_choice == 1:  # Make a move
                    if not game.piles:
                        print("No piles left to make a move from. Game is over.")
                        continue
                    while True:
                        pile_index = get_integer_input(f"Enter pile number to remove from (1 to {len(game.piles)}): ",
                                                       min_val=1, max_val=len(game.piles)) - 1
                        # Ensure the chosen pile still exists and has objects
                        if pile_index >= len(game.piles) or game.piles[pile_index] == 0:
                            print("Invalid pile selected. Please choose an existing pile with objects.")
                            continue

                        number_to_remove = get_integer_input(
                            f"Enter number of objects to remove from Pile {pile_index + 1} "
                            f"(1 to {game.piles[pile_index]}): ",
                            min_val=1, max_val=game.piles[pile_index])

                        if game.remove(pile_index, number_to_remove):
                            print(f"Player {3 - game.player} removed {number_to_remove} from Pile {pile_index + 1}.")
                            break  # Valid move made, break from inner loop
                        else:
                            print("Invalid move. Please try again (e.g., not enough objects in pile).")

                elif player_action_choice == 2:  # Let the computer make a move
                    print("Computer is thinking...")
                    move = game.find_optimal_move()
                    if move:
                        pile_index, number_to_remove = move
                        # Call remove, which handles history and player switch
                        if game.remove(pile_index, number_to_remove):
                            print(f"Computer removed {number_to_remove} objects from Pile {pile_index + 1}.")
                        else:
                            # This case should not be reached if the find_optimal_move is correct and game is not over
                            print(
                                "Computer attempted an invalid move, indicating an issue in AI logic or game state.")
                    else:
                        print("Computer cannot make a move (no piles left or an unexpected state).")
                        # If move is None, it implies game is already over or no piles exist.
                        if game.is_game_over():
                            print("Game is already over.")
                            break

                elif player_action_choice == 3:  # Undo last move
                    game.undo_move()

                elif player_action_choice == 4:  # Restart current game
                    if game.initial_piles:
                        print("Restarting current game with original piles...")
                        game.start(game.initial_piles)  # Re-initialize with stored initial piles
                    else:
                        print("Cannot restart. No initial game state found. Please start a new game.")

                elif player_action_choice == 5:  # Start a new game (back to main menu)
                    print("Returning to main menu to start a new game...")
                    break

                elif player_action_choice == 6:  # Quit program
                    print("Thanks for playing! Goodbye.")
                    return  # Exit the main function and terminate the program


if __name__ == "__main__":
    main()
