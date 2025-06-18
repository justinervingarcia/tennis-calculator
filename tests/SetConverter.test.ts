import { SetConverter } from '../src/SetConverter';
import { Player } from '../src/Player';
import { Game } from '../src/Game';

describe('SetConverter', () => {
  let converter: SetConverter;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    converter = new SetConverter();
    player1 = new Player('Player 1');
    player2 = new Player('Player 2');
  });

  const createWonGame = (winner: Player, loser: Player): Game => {
    const game = new Game(winner, loser);
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    return game;
  };

  const createPlayer1WinGames = (count: number): Game[] => {
    const games: Game[] = [];
    for (let i = 0; i < count; i++) {
      games.push(createWonGame(player1, player2));
    }
    return games;
  };

  const createPlayer2WinGames = (count: number): Game[] => {
    const games: Game[] = [];
    for (let i = 0; i < count; i++) {
      games.push(createWonGame(player2, player1));
    }
    return games;
  };

  describe('convertGamesToSets', () => {
    it('should return empty array for no games', () => {
      const result = converter.convertGamesToSets([], player1, player2);

      expect(result).toEqual([]);
    });

    it('should create one incomplete set for insufficient games', () => {
      const games = createPlayer1WinGames(3);
      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isFinished()).toBe(false);
      expect(result[0].getSetScore()).toBe('3 - 0');
    });

    it('should create one complete set when player1 wins 6 games', () => {
      const games = createPlayer1WinGames(6);
      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isFinished()).toBe(true);
      expect(result[0].getSetScore()).toBe('6 - 0');
      expect(result[0].getWinner()?.name).toBe('Player 1');
    });

    it('should create one complete set when player2 wins 6 games', () => {
      const games = createPlayer2WinGames(6);
      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isFinished()).toBe(true);
      expect(result[0].getSetScore()).toBe('0 - 6');
      expect(result[0].getWinner()?.name).toBe('Player 2');
    });

    it('should create multiple sets from multiple sequences', () => {
      // Set 1: Player 1 wins 6-0, Set 2: Player 2 wins 6-1
      const games = [
        ...createPlayer1WinGames(6), // First set: Player 1 wins 6-0
        ...createPlayer1WinGames(1), // Second set: Player 1 gets 1 game
        ...createPlayer2WinGames(6), // Second set: Player 2 wins 6-1
      ];

      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(2);

      // First set
      expect(result[0].isFinished()).toBe(true);
      expect(result[0].getSetScore()).toBe('6 - 0');
      expect(result[0].getWinner()?.name).toBe('Player 1');

      // Second set
      expect(result[1].isFinished()).toBe(true);
      expect(result[1].getSetScore()).toBe('1 - 6');
      expect(result[1].getWinner()?.name).toBe('Player 2');
    });

    it('should handle alternating game wins correctly', () => {
      const games = [
        createWonGame(player1, player2), // 1-0
        createWonGame(player2, player1), // 1-1
        createWonGame(player1, player2), // 2-1
        createWonGame(player1, player2), // 3-1
        createWonGame(player2, player1), // 3-2
        createWonGame(player1, player2), // 4-2
        createWonGame(player1, player2), // 5-2
        createWonGame(player1, player2), // 6-2 (Player 1 wins set)
      ];

      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isFinished()).toBe(true);
      expect(result[0].getSetScore()).toBe('6 - 2');
      expect(result[0].getWinner()?.name).toBe('Player 1');
    });

    it('should handle complete set followed by incomplete set', () => {
      const games = [...createPlayer1WinGames(6), ...createPlayer2WinGames(3)];

      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(2);

      // First set (complete)
      expect(result[0].isFinished()).toBe(true);
      expect(result[0].getSetScore()).toBe('6 - 0');

      // Second set (incomplete)
      expect(result[1].isFinished()).toBe(false);
      expect(result[1].getSetScore()).toBe('0 - 3');
    });

    it('should handle single game correctly', () => {
      const games = createPlayer1WinGames(1);
      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isFinished()).toBe(false);
      expect(result[0].getSetScore()).toBe('1 - 0');
      expect(result[0].getGames()).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should not create empty sets', () => {
      const result = converter.convertGamesToSets([], player1, player2);

      expect(result).toEqual([]);
    });

    it('should handle exactly 6 games correctly', () => {
      const games = createPlayer1WinGames(6);
      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isFinished()).toBe(true);
      expect(result[0].getGames()).toHaveLength(6);
    });

    it('should start new set immediately after previous set finishes', () => {
      const games = createPlayer1WinGames(7);
      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(2);
      expect(result[0].isFinished()).toBe(true);
      expect(result[0].getGames()).toHaveLength(6);
      expect(result[1].isFinished()).toBe(false);
      expect(result[1].getGames()).toHaveLength(1);
    });
  });

  describe('game state verification', () => {
    it('should only include finished games in sets', () => {
      // Create an unfinished game
      const unfinishedGame = new Game(player1, player2);
      unfinishedGame.player1Scores(); // Only 1 point, not finished

      const games = [...createPlayer1WinGames(2), unfinishedGame];
      const result = converter.convertGamesToSets(games, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].getGames()).toHaveLength(3); // Should include all games, even unfinished
    });
  });
});
