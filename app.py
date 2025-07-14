from fastapi import FastAPI
from fastapi.responses import FileResponse
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
async def start(initial_piles):
    return game.start(initial_piles)


@app.post("/remove")
async def remove(pile_index, number_to_remove):
    return game.remove(pile_index, number_to_remove)


@app.post("/undo_move")
async def undo_move():
    return game.undo_move()


@app.get("/is_game_over")
async def is_game_over():
    return game.is_game_over()


@app.get("/get_winner")
async def get_winner():
    return game.get_winner()


@app.get("/calculate_nim_sum")
async def calculate_nim_sum():
    return game.calculate_nim_sum()


@app.get("/find_optimal_move")
async def find_optimal_move():
    return game.find_optimal_move()
