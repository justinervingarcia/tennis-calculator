import * as fs from 'fs';
import { Player } from '../src/Player';
import { TournamentParser } from '../src/TournamentParser';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('Tournament Parser', () => {
  let parser: TournamentParser;

  beforeEach(() => {
    parser = new TournamentParser();
  });

  it('should parse and extract Match ID', () => {
    expect(parser.parseMatchHeader('Match: 01')).toBe('01');
  });

  it('should parse and extract player names', () => {
    expect(parser.parseMatchPlayers('Person A vs Person B')).toEqual({
      player1: 'Person A',
      player2: 'Person B',
    });
  });

  it('should parse point sequences with 1 game', () => {
    const player1 = new Player('Person A');
    const player2 = new Player('Person B');
    const games = parser.parsePointSequence([0, 0, 0, 0], player1, player2);

    expect(games).toHaveLength(1);
    expect(games[0].isOver()).toBe(true);
    expect(games[0].getCurrentScore()).toBe('Game');
    expect(games[0].getWinner()).toBe('Person A');
  });

  it('should parse point sequences with 2 games', () => {
    const player1 = new Player('Person A');
    const player2 = new Player('Person B');
    const games = parser.parsePointSequence(
      [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      player1,
      player2
    );

    expect(games).toHaveLength(2);
    expect(games[0].isOver()).toBe(true);
    expect(games[0].getCurrentScore()).toBe('Game');
    expect(games[0].getWinner()).toBe('Person A');
    expect(games[1].isOver()).toBe(true);
    expect(games[1].getCurrentScore()).toBe('Game');
    expect(games[1].getWinner()).toBe('Person A');
  });

  it('should parse point sequences with incomplete game', () => {
    const player1 = new Player('Person A');
    const player2 = new Player('Person B');
    const games = parser.parsePointSequence([0, 1], player1, player2);

    expect(games).toHaveLength(1);
    expect(games[0].isOver()).toBe(false);
    expect(games[0].getCurrentScore()).toBe('15 - 15');
    expect(games[0].getWinner()).toBeNull();
  });

  it('should parse a single match chunk', () => {
    const mockTournamentData = `Match: 01
      Person A vs Person B
      0
      0
      0
      0
      1
      1
      1
      1`;

    const match = parser.parseMatch(mockTournamentData);

    expect(match.getMatchNumber()).toBe('01');
    expect(match.player1.name).toBe('Person A');
    expect(match.player2.name).toBe('Person B');
  });

  it('should parse a complete match', () => {
    const mockTournamentData = `Match: 01
      Person A vs Person B
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0`;

    const match = parser.parseMatch(mockTournamentData);

    expect(match.getMatchNumber()).toBe('01');
    expect(match.player1.name).toBe('Person A');
    expect(match.player2.name).toBe('Person B');
    expect(match.getSets()).toHaveLength(2);
    expect(match.isMatchEnd()).toBe(true);
    expect(match.getMatchScore()).toBe('2 sets to 0');
  });

  it('should parse multiple matches', () => {
    const mockTournamentData = `Match: 01
      Person A vs Person B
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      Match: 02
      Person A vs Person C
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      0
      0
      0
      0

      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1

      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      `;

    const matches = parser.parseMatches(mockTournamentData);

    expect(matches).toHaveLength(2);
    expect(matches[0].player1.name).toBe('Person A');
    expect(matches[0].player2.name).toBe('Person B');
    expect(matches[1].player1.name).toBe('Person A');
    expect(matches[1].player2.name).toBe('Person C');
  });

  it('should read and parse a tournament file', () => {
    const mockTournamentData = `Match: 01
      Person A vs Person B
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      Match: 02
      Person A vs Person C
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      0
      0
      0
      0

      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1

      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      0
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      1
      `;

    mockedFs.readFileSync.mockReturnValue(mockTournamentData);

    const tournament = parser.parseFile('full_tournament.txt');
    const matches = parser.parseMatches(tournament);

    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      'full_tournament.txt',
      'utf-8'
    );
    expect(matches).toHaveLength(2);
    expect(matches[0].player1.name).toBe('Person A');
    expect(matches[0].player2.name).toBe('Person B');
    expect(matches[1].player1.name).toBe('Person A');
    expect(matches[1].player2.name).toBe('Person C');
  });
});

describe('Tournament Parser Error Handling', () => {
  let parser: TournamentParser;

  beforeEach(() => {
    parser = new TournamentParser();
  });

  it('should throw error for invalid match header format', () => {
    expect(() => {
      parser.parseMatchHeader('Invalid format');
    }).toThrow('Invalid match format');
  });

  it('should throw error for invalid players format', () => {
    expect(() => {
      parser.parseMatchPlayers('Invalid format');
    }).toThrow('Invalid players format');
  });

  it('should throw error when match line is missing', () => {
    const invalidChunk = `Person A vs Person B\n0\n0`;
    expect(() => {
      parser.parseMatch(invalidChunk);
    }).toThrow("No line containing 'Match: ' found");
  });
});
