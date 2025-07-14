class Game:
    def __init__(self):
        self.piles = []
        self.player = 1
        self.history = []

    def start(self, piles):
        if len(piles) < 2:
            return False
        self.piles = [piles[i] for i in range(piles)]
        self.player = 1
        self.history = []
        return True

    def remove(self, index, number):
        self.history.append([i for i in self.piles])
        if 0 <= index < len(self.piles) and 0 < number <= self.piles[index]:
            self.piles[index] -= number
            if self.piles[index] == 0:
                self.piles.remove(index)
            self.player = 3 - self.player
            return True
        return False

    def get_winner(self):
        if len(self.piles) == 1:
            return self.player
        return -1


def main():
    print("Welcome to the Nim Solver!")


if __name__ == "__main__":
    main()
