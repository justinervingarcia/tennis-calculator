import { Player } from '../src/Player';
import { Game } from '../src/Game';

describe('Game', () => {
  let player1: Player;
  let player2: Player;
  let game: Game;

  beforeEach(() => {
    player1 = new Player('A');
    player2 = new Player('B');
    game = new Game(player1, player2);
  });

  it('should start with 0 points', () => {
    expect(game.getPlayer1Score()).toBe(0);
    expect(game.getPlayer2Score()).toBe(0);
  });

  it('should have 2 players', () => {
    expect(game.player1).toBe(player1);
    expect(game.player2).toBe(player2);
  });

  it('should increase points when player 1 scores', () => {
    game.player1Scores();

    expect(game.getPlayer1Score()).toBe(1);
    expect(game.getPlayer2Score()).toBe(0);
  });

  it('should increase points when player 2 scores', () => {
    game.player2Scores();

    expect(game.getPlayer2Score()).toBe(1);
    expect(game.getPlayer1Score()).toBe(0);
  });

  it('should be over when player reaches 4 points', () => {
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();

    expect(game.isOver()).toBe(true);
    expect(game.getCurrentScore()).toBe('Game');
  });

  // Edge case for isOver
  it('should not be over at 3-3 (deuce)', () => {
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();

    expect(game.isOver()).toBe(false);
  });

  // Edge case for isOver
  it('should not be over at 4-3', () => {
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();
    game.player1Scores();

    expect(game.isOver()).toBe(false);
  });

  it('becomes deuce when each player wins 3 points', () => {
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();

    expect(game.getCurrentScore()).toBe('Deuce');
  });

  it('becomes advantage when player wins the next point after deuce', () => {
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();

    expect(game.getCurrentScore()).toBe('Advantage Player B');
  });

  it('should display correct tennis scores', () => {
    game.player1Scores();
    expect(game.getCurrentScore()).toBe('15 - 0');
    game.player2Scores();
    expect(game.getCurrentScore()).toBe('15 - 15');
    game.player1Scores();
    expect(game.getCurrentScore()).toBe('30 - 15');
    game.player2Scores();
    expect(game.getCurrentScore()).toBe('30 - 30');
    game.player1Scores();
    expect(game.getCurrentScore()).toBe('40 - 30');
    game.player2Scores();
    expect(game.getCurrentScore()).toBe('Deuce');
  });

  it('should display winner when player wins the game', () => {
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();

    expect(game.getCurrentScore()).toBe('Game');
    expect(game.isOver()).toBe(true);
    expect(game.getWinner()).toBe('A');
  });

  it('should handle multiple deuces', () => {
    // Deuce
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();
    expect(game.getCurrentScore()).toBe('Deuce');

    // Advantage player 1, back to Deuce
    game.player1Scores();
    expect(game.getCurrentScore()).toBe('Advantage Player A');
    game.player2Scores();
    expect(game.getCurrentScore()).toBe('Deuce');

    // Advantage player 2, back to Deuce
    game.player2Scores();
    expect(game.getCurrentScore()).toBe('Advantage Player B');
    game.player1Scores();
    expect(game.getCurrentScore()).toBe('Deuce');
  });

  it('should win game from advantage', () => {
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();
    expect(game.getCurrentScore()).toBe('Advantage Player B');
    game.player2Scores();
    expect(game.getCurrentScore()).toBe('Game');
    expect(game.getWinner()).toBe('B');
  });

  it('should not add score after game ends', () => {
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();

    // score should remain 4 - 0
    expect(game.isOver()).toBe(true);
    game.player1Scores();
    expect(game.getPlayer1Score()).toBe(4);
    game.player2Scores();
    expect(game.getPlayer2Score()).toBe(0);
  });

  it('should not have a winner when game is not over', () => {
    game.player1Scores();
    expect(game.getWinner()).toBe(null);
  });

  it('should return Game for points >= 4', () => {
    expect(game.getCall(4)).toBe('Game');
    expect(game.getCall(5)).toBe('Game');
  });
});
