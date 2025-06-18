import { Game } from '../src/Game';
import { SetRules } from '../src/implementations/SetRules';
import { MatchRules } from '../src/implementations/MatchRules';
import { Player } from '../src/Player';
import { Set } from '../src/Set';
import { Match } from '../src/Match';

describe('Match', () => {
  let player1: Player;
  let player2: Player;
  let match: Match;

  beforeEach(() => {
    player1 = new Player('Person A');
    player2 = new Player('Person B');
    const matchRules = new MatchRules();
    match = new Match('01', player1, player2, matchRules);
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

  const player1WinsSet = (): Set => {
    const set = new Set(player1, player2, new SetRules());
    for (let i = 0; i < 6; i++) {
      const game = player1WinsGame();
      set.addWonGame(game);
    }
    return set;
  };

  const player2WinsSet = (): Set => {
    const set = new Set(player1, player2, new SetRules());
    for (let i = 0; i < 6; i++) {
      const game = player2WinsGame();
      set.addWonGame(game);
    }
    return set;
  };

  it('should have a match number', () => {
    expect(match.getMatchNumber()).toBe('01');
  });

  it('should have 2 players', () => {
    expect(match.player1).toBe(player1);
    expect(match.player2).toBe(player2);
  });

  it('should start the match with no sets played', () => {
    expect(match.getSets()).toHaveLength(0);
  });

  it('should increase set score after winning a set', () => {
    const set = player1WinsSet();
    match.addWonSet(set);

    expect(match.getSets()).toHaveLength(1);
    expect(match.getMatchScore()).toBe('1 sets to 0');
  });

  it('should end the match after winning 2 sets', () => {
    const set1 = player1WinsSet();
    match.addWonSet(set1);
    const set2 = player1WinsSet();
    match.addWonSet(set2);

    expect(match.isMatchEnd()).toBe(true);
    expect(match.getSets()).toHaveLength(2);
    expect(match.getMatchScore()).toBe('2 sets to 0');
  });

  it('should display match winner after winning 2 sets', () => {
    const set1 = player1WinsSet();
    match.addWonSet(set1);
    const set2 = player1WinsSet();
    match.addWonSet(set2);

    expect(match.getMatchWinner()).toBe('Person A defeated Person B');
  });

  it('should not have a winner without reaching 2 set wins', () => {
    const set1 = player1WinsSet();
    match.addWonSet(set1);

    expect(match.getMatchWinner()).toBeNull();
  });

  it('should not increase match score after match ends', () => {
    const set1 = player1WinsSet();
    match.addWonSet(set1);
    const set2 = player1WinsSet();
    match.addWonSet(set2);
    const set3 = player1WinsSet();
    match.addWonSet(set3);

    expect(match.getSets()).toHaveLength(2);
    expect(match.getMatchScore()).toBe('2 sets to 0');
    expect(match.getMatchWinner()).toBe('Person A defeated Person B');
  });

  it('should be "1 sets to 1" after 1 set each', () => {
    const set1 = player1WinsSet();
    match.addWonSet(set1);
    const set2 = player2WinsSet();
    match.addWonSet(set2);

    expect(match.getMatchScore()).toBe('1 sets to 1');
  });

  it('should not add a set win if set is not yet finished', () => {
    const set = new Set(player1, player2, new SetRules());
    const game = player1WinsGame();
    set.addWonGame(game);
    match.addWonSet(set);

    expect(match.getSets()).toHaveLength(0);
    expect(match.getMatchScore()).toBe('0 sets to 0');
  });

  it('should display player 2 as winner if player 2 wins the match', () => {
    const set1 = player2WinsSet();
    match.addWonSet(set1);
    const set2 = player2WinsSet();
    match.addWonSet(set2);

    expect(match.getMatchWinner()).toBe('Person B defeated Person A');
  });
});
