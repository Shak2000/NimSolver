# Nim Solver

A modern, interactive implementation of the classic mathematical game Nim with both web interface and command-line versions. Features an AI opponent that uses optimal Nim-sum strategy.

## 🎮 What is Nim?

Nim is a mathematical strategy game where players take turns removing objects from distinct piles. The player who takes the last object wins. This implementation includes:

- **Strategic AI**: Computer opponent uses Nim-sum (XOR) strategy for optimal play
- **Web Interface**: Modern, responsive UI built with Tailwind CSS
- **Command Line**: Traditional terminal-based gameplay
- **Game Features**: Undo moves, restart games, and step-by-step gameplay

## 🚀 Features

- **Dual Interface**: Play via web browser or command line
- **Smart AI**: Computer uses mathematical optimal strategy
- **Game Management**: Start new games, restart current game, undo moves
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live game state updates in web interface
- **Input Validation**: Comprehensive error handling and validation

## 📁 Project Structure

```
nim-solver/
├── app.py          # FastAPI web server
├── main.py         # Core game logic and CLI interface
├── index.html      # Web interface HTML
├── styles.css      # Custom styling
├── script.js       # Frontend JavaScript
└── README.md       # This file
```

## 🛠️ Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Setup

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd nim-solver
   
   # Or download and extract the files to a folder
   ```

2. **Install dependencies**
   ```bash
   pip install fastapi uvicorn
   ```

3. **Verify installation**
   ```bash
   python -c "import fastapi, uvicorn; print('Dependencies installed successfully')"
   ```

## 🎯 How to Play

### Web Interface (Recommended)

1. **Start the web server**
   ```bash
   python -m uvicorn app:app --reload
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

3. **Game Setup**:
   - Enter the number of piles (minimum 2)
   - Set the size of each pile
   - Click "Start Game"

4. **Gameplay**:
   - Enter pile number and objects to remove
   - Click "Make Move" or use "Let Computer Move"
   - Use "Undo Last Move" to reverse actions
   - "Restart Current Game" to replay with same setup

### Command Line Interface

1. **Run the CLI version**
   ```bash
   python main.py
   ```

2. **Follow the prompts**:
   - Choose to start a new game or quit
   - Enter number of piles and their sizes
   - Select actions from the menu during gameplay

## 🧠 Game Strategy

### Nim-Sum Theory

The AI uses the mathematical concept of Nim-sum (XOR of all pile sizes):

- **Winning Position**: Nim-sum = 0 (opponent will eventually lose with optimal play)
- **Losing Position**: Nim-sum ≠ 0 (can be converted to winning position)

### AI Behavior

- **When Nim-sum ≠ 0**: Makes optimal move to set Nim-sum to 0
- **When Nim-sum = 0**: Makes defensive move (removes 1 from largest pile)

### Playing Tips

1. **Learn the Pattern**: Try to leave your opponent in positions where Nim-sum = 0
2. **Use the Computer**: Let the AI make moves to see optimal strategy
3. **Practice**: Use the undo feature to experiment with different moves

## 🔧 API Endpoints

The web interface communicates with these FastAPI endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves the web interface |
| `/start` | POST | Initialize game with pile sizes |
| `/remove` | POST | Make a move (remove objects) |
| `/undo_move` | POST | Undo the last move |
| `/find_optimal_move` | GET | Get AI's optimal move |
| `/get_game_state` | GET | Get current game state |
| `/get_initial_piles_for_restart` | GET | Get initial piles for restart |

## 🎨 Customization

### Styling

- **CSS**: Modify `styles.css` for custom styling
- **Colors**: Built with Tailwind CSS classes in `index.html`
- **Responsive**: Automatically adapts to different screen sizes

### Game Rules

- **Winning Condition**: Modify `get_winner()` in `main.py`
- **AI Strategy**: Adjust `find_optimal_move()` for different AI behaviors
- **Validation**: Update input validation in both frontend and backend

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   pip install fastapi uvicorn
   ```

2. **Port already in use**
   ```bash
   python -m uvicorn app:app --reload --port 8001
   ```

3. **Browser not updating**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Check browser console for errors

### Debug Mode

Run with verbose logging:
```bash
python -m uvicorn app:app --reload --log-level debug
```

## 📝 Example Game

```
Starting piles: [3, 5, 7]
Nim-sum: 3 ⊕ 5 ⊕ 7 = 1 (losing position)

Optimal move: Remove 2 from pile 3 (size 7)
Result: [3, 5, 5]
New Nim-sum: 3 ⊕ 5 ⊕ 5 = 3 (winning position)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both web and CLI interfaces
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Nim Theory**: Based on mathematical game theory
- **UI Framework**: Built with Tailwind CSS
- **Backend**: Powered by FastAPI
- **Mathematics**: Implements Sprague-Grundy theorem for optimal play

---

**Enjoy playing Nim!** 🎲

For questions or issues, please refer to the troubleshooting section or create an issue in the project repository.
