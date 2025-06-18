import * as fs from 'fs';

import { Game } from './Game';
import { MatchRules } from './implementations/MatchRules';
import { IPlayerInfo } from './interfaces/PlayerInfo';
import { Match } from './Match';
import { Player } from './Player';
import { Set } from './Set';
import { GameSequenceParser } from './GameSequenceParser';
import { SetConverter } from './SetConverter';

interface PlayerPair {
  player1: string;
  player2: string;
}

interface MatchData {
  matchId: string;
  players: PlayerPair;
  pointSequence: number[];
}

export class TournamentParser {
  private static readonly MATCH_PREFIX = 'Match: ';
  private static readonly PLAYER_SEPARATOR = 'vs';
  private static readonly HEADER_LINES_TO_SKIP = 2;
  private static readonly EXPECTED_PARTS_COUNT = 2;

  constructor() {}

  /**
   * Parse multiple matches from tournament data
   * @param content Raw tournament file content
   * @returns Array of parsed Match objects
   */
  public parseMatches(content: string): Match[] {
    const matchChunks = this.splitIntoMatches(content);
    return matchChunks.map((chunk) => this.parseMatch(chunk));
  }

  /**
   * Parse a single match from chunk data
   * @param chunk Single match text chunk
   * @returns Parsed Match object
   */
  public parseMatch(chunk: string): Match {
    const matchData = this.extractMatchData(chunk);
    return this.createMatchFromData(matchData);
  }

  /**
   * Parse a file and return its content
   */
  public parseFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Parse match header to extract match ID
   */
  public parseMatchHeader(matchLine: string): string {
    const parts = matchLine.split(TournamentParser.MATCH_PREFIX);
    this.validatePartsCount(parts, 'Invalid match format');
    return parts[1].trim();
  }

  /**
   * Parse players line to extract player names
   */
  public parseMatchPlayers(playersLine: string): PlayerPair {
    const parts = playersLine.split(TournamentParser.PLAYER_SEPARATOR);
    this.validatePartsCount(parts, 'Invalid players format');

    return {
      player1: parts[0].trim(),
      player2: parts[1].trim(),
    };
  }

  /**
   * Parse point sequence into games
   */
  public parsePointSequence(
    pointSequence: number[],
    player1: IPlayerInfo,
    player2: IPlayerInfo
  ): Game[] {
    const gameSequenceParser = new GameSequenceParser();
    return gameSequenceParser.parseGames(pointSequence, player1, player2);
  }

  /**
   * Orchestrates the extraction of all match components from raw text
   * Validates the extracted data before returning
   */
  private extractMatchData(chunk: string): MatchData {
    const lines = this.splitIntoLines(chunk);
    const matchId = this.extractMatchId(lines);
    const players = this.extractPlayers(lines);
    const pointSequence = this.extractPointSequence(lines);

    this.validateMatchData(matchId, players);
    return { matchId, players, pointSequence };
  }

  /**
   * Splits tournament content using regex lookahead to preserve "Match:" prefix
   * The (?=Match:) pattern keeps "Match:" at the start of each chunk
   */
  private splitIntoMatches(content: string): string[] {
    return content
      .split(/(?=Match:)/)
      .filter((chunk) => chunk.trim().length > 0);
  }

  private splitIntoLines(chunk: string): string[] {
    return chunk.split('\n');
  }

  private extractMatchId(lines: string[]): string {
    const matchLine = this.findLineContaining(
      lines,
      TournamentParser.MATCH_PREFIX
    );
    return this.parseMatchHeader(matchLine);
  }

  private extractPlayers(lines: string[]): PlayerPair {
    const playersLine = this.findLineContaining(
      lines,
      TournamentParser.PLAYER_SEPARATOR
    );
    return this.parseMatchPlayers(playersLine);
  }

  private extractPointSequence(lines: string[]): number[] {
    const pointLines = lines
      .slice(TournamentParser.HEADER_LINES_TO_SKIP)
      .filter((line) => this.isValidLine(line));

    return pointLines.map((line) => this.parsePoint(line));
  }

  private parsePoint(line: string): number {
    const point = parseInt(line.trim(), 10);
    if (isNaN(point)) {
      throw new Error(`Invalid point value: ${line}`);
    }
    return point;
  }

  private isValidLine(line: string): boolean {
    return line.trim().length > 0;
  }

  private createMatchFromData(matchData: MatchData): Match {
    const { matchId, players, pointSequence } = matchData;

    const player1 = new Player(players.player1);
    const player2 = new Player(players.player2);
    const match = new Match(matchId, player1, player2, new MatchRules());

    const games = this.parsePointSequence(pointSequence, player1, player2);
    const sets = this.convertGamesToSets(games, player1, player2);

    sets.forEach((set) => match.addWonSet(set));
    return match;
  }

  private convertGamesToSets(
    games: Game[],
    player1: IPlayerInfo,
    player2: IPlayerInfo
  ): Set[] {
    const setConverter = new SetConverter();
    return setConverter.convertGamesToSets(games, player1, player2);
  }

  private findLineContaining(lines: string[], content: string): string {
    const line = lines.find((line) => line.includes(content));
    if (!line) {
      throw new Error(`No line containing '${content}' found`);
    }
    return line;
  }

  private validatePartsCount(parts: string[], errorMessage: string): void {
    if (parts.length !== TournamentParser.EXPECTED_PARTS_COUNT) {
      throw new Error(errorMessage);
    }
  }

  private validateMatchData(matchId: string, players: PlayerPair): void {
    if (!matchId || !players.player1 || !players.player2) {
      throw new Error('Failed to parse match data');
    }
  }
}
