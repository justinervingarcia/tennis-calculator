import { GameSequenceParser } from '../src/GameSequenceParser';
import { Player } from '../src/Player';

describe('GameSequenceParser', () => {
  let parser: GameSequenceParser;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    parser = new GameSequenceParser();
    player1 = new Player('Player 1');
    player2 = new Player('Player 2');
  });

  describe('parseGames', () => {
    it('should return empty array for empty point sequence', () => {
      const result = parser.parseGames([], player1, player2);

      expect(result).toEqual([]);
    });

    it('should create a single incomplete game for incomplete point sequence', () => {
      const pointSequence = [0, 1, 0]; // 2-1 in points
      const result = parser.parseGames(pointSequence, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].getPlayer1Score()).toBe(2);
      expect(result[0].getPlayer2Score()).toBe(1);
      expect(result[0].isOver()).toBe(false);
    });

    it('should create one complete game for minimum winning sequence', () => {
      const pointSequence = [0, 0, 0, 0]; // Player 1 wins 4-0
      const result = parser.parseGames(pointSequence, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isOver()).toBe(true);
      expect(result[0].getWinner()).toBe('Player 1');
    });

    it('should handle deuce and advantage correctly', () => {
      // 3-3 then Player 1 wins advantage and game
      const pointSequence = [0, 1, 0, 1, 0, 1, 0, 0];
      const result = parser.parseGames(pointSequence, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isOver()).toBe(true);
      expect(result[0].getWinner()).toBe('Player 1');
    });

    it('should create multiple games from multiple sequences', () => {
      // Game 1: Player 1 wins 4-0, Game 2: Player 2 wins 4-0
      const pointSequence = [0, 0, 0, 0, 1, 1, 1, 1];
      const result = parser.parseGames(pointSequence, player1, player2);

      expect(result).toHaveLength(2);

      // First game
      expect(result[0].isOver()).toBe(true);
      expect(result[0].getWinner()).toBe('Player 1');

      // Second game
      expect(result[1].isOver()).toBe(true);
      expect(result[1].getWinner()).toBe('Player 2');
    });

    it('should handle alternating wins correctly', () => {
      // Player 1 wins first game, Player 2 wins second game
      const pointSequence = [
        0,
        0,
        0,
        0, // Game 1: Player 1 wins 4-0
        1,
        1,
        1,
        1, // Game 2: Player 2 wins 4-0
      ];
      const result = parser.parseGames(pointSequence, player1, player2);

      expect(result).toHaveLength(2);
      expect(result[0].getWinner()).toBe('Player 1');
      expect(result[1].getWinner()).toBe('Player 2');
    });

    it('should handle long deuce game correctly', () => {
      // Long deuce game: 3-3, then several advantages before Player 1 wins
      const pointSequence = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0];
      const result = parser.parseGames(pointSequence, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isOver()).toBe(true);
      expect(result[0].getWinner()).toBe('Player 1');
    });

    it('should handle mixed complete and incomplete games', () => {
      // Complete game + partial game
      const pointSequence = [0, 0, 0, 0, 1, 1]; // Complete game + partial
      const result = parser.parseGames(pointSequence, player1, player2);

      expect(result).toHaveLength(2);
      expect(result[0].isOver()).toBe(true);
      expect(result[1].isOver()).toBe(false);
      expect(result[1].getPlayer2Score()).toBe(2);
    });

    it('should not add empty games to result', () => {
      // Just enough points for one complete game, no extra
      const pointSequence = [0, 0, 0, 0];
      const result = parser.parseGames(pointSequence, player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].isOver()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle single point', () => {
      const result = parser.parseGames([0], player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].getPlayer1Score()).toBe(1);
      expect(result[0].getPlayer2Score()).toBe(0);
      expect(result[0].isOver()).toBe(false);
    });

    it('should handle invalid point values gracefully', () => {
      // Assuming 0 and 1 are valid, anything else should be treated as Player 2
      const result = parser.parseGames([0, 2, 0, 1], player1, player2);

      expect(result).toHaveLength(1);
      expect(result[0].getPlayer1Score()).toBe(2);
      expect(result[0].getPlayer2Score()).toBe(2);
    });
  });
});
