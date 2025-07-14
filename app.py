from fastapi import FastAPI, Body  # Import Body
from fastapi.responses import FileResponse
from typing import List  # Import List for type hinting
from main import Game

game = Game()
app = FastAPI()


@app.get("/")
async def get_ui():
    return FileResponse("index.html")


@app.get("/styles.css")
async def get_styles():
    return FileResponse("styles.css")


@app.get("/script.js")
async def get_script():
    return FileResponse("script.js")


@app.post("/start")
async def start(initial_piles: List[int] = Body(...)): # Use Body to read from request body
    """
    Starts a new Nim game with the given initial pile sizes.
    Expects a JSON array of integers in the request body.
    """
    return game.start(initial_piles)


@app.post("/remove")
async def remove(pile_index: int, number_to_remove: int): # Add type hints for clarity and validation
    """
    Removes a specified number of objects from a pile.
    Expects pile_index and number_to_remove as query parameters.
    """
    return game.remove(pile_index, number_to_remove)


@app.post("/undo_move")
async def undo_move():
    """
    Undoes the last move made in the game.
    """
    return game.undo_move()


@app.get("/is_game_over")
async def is_game_over():
    """
    Checks if the game is over.
    """
    return game.is_game_over()


@app.get("/get_winner")
async def get_winner():
    """
    Returns the winner of the game if it's over, otherwise -1.
    """
    return game.get_winner()


@app.get("/calculate_nim_sum")
async def calculate_nim_sum():
    """
    Calculates the Nim-sum of the current piles.
    """
    return game.calculate_nim_sum()


@app.get("/find_optimal_move")
async def find_optimal_move():
    """
    Finds the optimal move for the computer based on Nim-sum strategy.
    """
    return game.find_optimal_move()


@app.get("/get_game_state")
async def get_game_state():
    """
    Returns the current state of the game (piles, current player, game over status, winner).
    """
    return {"piles": game.piles, "player": game.player, "is_game_over": game.is_game_over(), "winner": game.get_winner()}


@app.get("/get_initial_piles_for_restart")
async def get_initial_piles_for_restart():
    """
    Returns the initial pile configuration for restarting the game.
    """
    return {"initial_piles": game.initial_piles}
