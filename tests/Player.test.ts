import { Game } from '../src/Game';
import { Player } from '../src/Player';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player('A');
  });

  it('should have a name', () => {
    expect(player).not.toBeUndefined();
    expect(player.name).toBe('A');
  });

  it('should have wins and losses that start at 0', () => {
    expect(player.getWins()).toBe(0);
    expect(player.getLosses()).toBe(0);
  });

  it('should track wins correctly', () => {
    player.addWin();
    expect(player.getWins()).toBe(1);
  });

  it('should track losses correctly', () => {
    player.addLoss();
    expect(player.getLosses()).toBe(1);
  });

  it('should increase win/loss after each game', () => {
    const player2 = new Player('B');
    const game = new Game(player, player2);
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();
    game.player1Scores();

    player.addWin();
    player2.addLoss();

    expect(player.getWins()).toBe(1);
    expect(player.getLosses()).toBe(0);
    expect(player2.getWins()).toBe(0);
    expect(player2.getLosses()).toBe(1);
  });
});
