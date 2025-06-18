import { Game } from '../src/Game';
import { SetRules } from '../src/implementations/SetRules';
import { Player } from '../src/Player';
import { Set } from '../src/Set';

describe('Set', () => {
  let player1: Player;
  let player2: Player;
  let set: Set;

  beforeEach(() => {
    player1 = new Player('A');
    player2 = new Player('B');
    set = new Set(player1, player2, new SetRules());
  });

  const player1WinsGame = (): Game => {
    const game = new Game(player1, player2);
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    return game;
  };

  const player2WinsGame = (): Game => {
    const game = new Game(player1, player2);
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();
    game.player2Scores();
    return game;
  };

  it('should have 2 players', () => {
    expect(set.player1).toBe(player1);
    expect(set.player2).toBe(player2);
  });

  it('should start with 0 - 0', () => {
    expect(set.getSetScore()).toBe('0 - 0');
  });

  it('should be 1 - 0 when player 1 wins', () => {
    const game = player1WinsGame();
    set.addWonGame(game);

    expect(game.getWinner()).toBe(player1.name);
    expect(set.getSetScore()).toBe('1 - 0');
  });

  it('should end the set with first player to win 6 games', () => {
    const game1 = player1WinsGame();
    set.addWonGame(game1);
    const game2 = player1WinsGame();
    set.addWonGame(game2);
    const game3 = player1WinsGame();
    set.addWonGame(game3);
    const game4 = player1WinsGame();
    set.addWonGame(game4);
    const game5 = player1WinsGame();
    set.addWonGame(game5);
    const game6 = player1WinsGame();
    set.addWonGame(game6);

    expect(set.isFinished()).toBe(true);
  });

  it('should win the set with 6 - 5', () => {
    const game1 = player1WinsGame();
    set.addWonGame(game1);
    const game2 = player1WinsGame();
    set.addWonGame(game2);
    const game3 = player1WinsGame();
    set.addWonGame(game3);
    const game4 = player1WinsGame();
    set.addWonGame(game4);
    const game5 = player1WinsGame();
    set.addWonGame(game5);
    const game6 = player2WinsGame();
    set.addWonGame(game6);
    const game7 = player1WinsGame();
    set.addWonGame(game7);

    expect(set.isFinished()).toBe(true);
  });

  it('should contain multiple games', () => {
    const game1 = player1WinsGame();
    set.addWonGame(game1);
    const game2 = player1WinsGame();
    set.addWonGame(game2);

    expect(set.getGames().length).toBe(2);
    expect(set.getGames()).toEqual([game1, game2]);
    expect(set.getGames()[0]).toEqual(game1);
  });

  it('should display winning player at the end of each set', () => {
    const game1 = player1WinsGame();
    set.addWonGame(game1);
    const game2 = player1WinsGame();
    set.addWonGame(game2);
    const game3 = player1WinsGame();
    set.addWonGame(game3);
    const game4 = player1WinsGame();
    set.addWonGame(game4);
    const game5 = player1WinsGame();
    set.addWonGame(game5);
    const game6 = player1WinsGame();
    set.addWonGame(game6);

    expect(set.getWinner()).toBe(player1);
  });

  it('should not finish when player has not reached 6 wins', () => {
    const game1 = player1WinsGame();
    set.addWonGame(game1);

    expect(set.isFinished()).toBe(false);
  });

  it('should not have a winner when set is not complete', () => {
    const game1 = player1WinsGame();
    set.addWonGame(game1);

    expect(set.getWinner()).toBeNull();
  });

  // To test uncovered branch
  it('should display Player 2 as winner when they win the set', () => {
    for (let i = 0; i < 6; i++) {
      const game = player2WinsGame();
      set.addWonGame(game);
    }

    expect(set.getWinner()).toBe(player2);
  });

  it('should not add set score after set finishes', () => {
    for (let i = 0; i < 7; i++) {
      const game = player1WinsGame();
      set.addWonGame(game);
    }

    expect(set.getSetScore()).toBe('6 - 0');
  });
});
