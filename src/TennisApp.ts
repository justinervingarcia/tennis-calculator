import * as fs from 'fs';
import * as readline from 'readline';

import { TournamentParser } from './TournamentParser';
import { Match } from './Match';
import { Player } from './Player';
import { IGameResult } from './interfaces/GameInfo';

export class TennisApp {
  private parser: TournamentParser;
  private matches: Match[] = [];
  private isDataLoaded: boolean = false;
  private playerRegistry: Map<string, Player> = new Map();
  private rl?: readline.Interface;

  constructor() {
    this.parser = new TournamentParser();
  }

  public run(args: string[]): void {
    if (args.length === 0) {
      this.showHelp();
      return;
    }

    const filename = args[0];
    this.loadTournamentFile(filename);

    if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
      this.startInteractiveMode();
    }
  }

  public loadTournamentFile(filename: string): void {
    try {
      const tournamentData = fs.readFileSync(filename, 'utf-8');
      this.matches = this.parser.parseMatches(tournamentData);
      this.isDataLoaded = true;
      this.updatePlayerGameStats();
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        throw new Error(`File not found: ${filename}`);
      }
      throw error;
    }
  }

  public processQuery(query: string): void {
    if (!query || query.trim() === '') {
      throw new Error('Query cannot be empty');
    }

    const trimmedQuery = query.trim();
    const parts = trimmedQuery.split(' ');

    if (parts.length < 2) {
      throw new Error(
        'Unknown query command. Available commands: Score Match, Games Player'
      );
    }

    const command = `${parts[0]} ${parts[1]}`;

    switch (command) {
      case 'Score Match':
        this.handleScoreMatchQuery(parts);
        break;
      case 'Games Player':
        this.handleGamesPlayerQuery(parts);
        break;
      default:
        throw new Error(
          'Unknown query command. Available commands: Score Match, Games Player'
        );
    }
  }

  private handleScoreMatchQuery(parts: string[]): void {
    this.validateDataLoaded();
    if (parts.length !== 3) {
      throw new Error('Invalid query format. Expected: Score Match <id>');
    }

    const matchId = parts[2];
    const match = this.matches.find((m) => m.getMatchNumber() === matchId);

    if (!match) {
      throw new Error(`Match not found: ${matchId}`);
    }

    if (!match.isMatchEnd()) {
      console.log('Match in progress');
      return;
    }

    const matchWinner = match.getMatchWinner();
    if (matchWinner) {
      // Extract winner and loser from the match winner string
      const winnerMatch = matchWinner.match(/(.+) defeated (.+)/);
      if (winnerMatch) {
        console.log(`${winnerMatch[1]} defeated ${winnerMatch[2]}`);
      } else {
        console.log(matchWinner);
      }
      console.log(match.getMatchScore());
    }
  }

  private handleGamesPlayerQuery(parts: string[]): void {
    this.validateDataLoaded();
    if (parts.length < 3) {
      throw new Error(
        'Invalid query format. Expected: Games Player <Player Name>'
      );
    }

    // Join all parts after "Games Player" to handle names with spaces
    const playerName = parts.slice(2).join(' ');

    const player = this.playerRegistry.get(playerName);
    if (!player) {
      throw new Error(`Player not found: ${playerName}`);
    }

    console.log(`${player.getWins()} ${player.getLosses()}`);
  }

  private updatePlayerGameStats(): void {
    this.playerRegistry.clear();
    this.initializeAllPlayers();
    this.countGameResults();
  }

  private initializeAllPlayers(): void {
    const playerNames = this.extractUniquePlayerNames();
    playerNames.forEach((name) => {
      this.playerRegistry.set(name, new Player(name));
    });
  }

  private extractUniquePlayerNames(): string[] {
    const playerNames = new Set<string>();

    this.matches.forEach((match) => {
      playerNames.add(match.player1.name);
      playerNames.add(match.player2.name);
    });

    return Array.from(playerNames);
  }

  private countGameResults(): void {
    this.matches.forEach((match) => {
      this.processMatchGames(match);
    });
  }

  private processMatchGames(match: Match): void {
    const player1 = this.getPlayerFromRegistry(match.player1.name);
    const player2 = this.getPlayerFromRegistry(match.player2.name);

    match.getSets().forEach((set) => {
      set.getGames().forEach((game) => {
        this.recordGameResult(game, player1, player2);
      });
    });
  }

  private recordGameResult(
    game: IGameResult,
    player1: Player,
    player2: Player
  ): void {
    const winner = game.getWinner();

    if (winner === player1.name) {
      player1.addWin();
      player2.addLoss();
    } else if (winner === player2.name) {
      player2.addWin();
      player1.addLoss();
    }
  }

  private getPlayerFromRegistry(playerName: string): Player {
    const player = this.playerRegistry.get(playerName);
    if (!player) {
      throw new Error(`Player not found in registry: ${playerName}`);
    }
    return player;
  }

  private startInteractiveMode(): void {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('\n=== Tennis Tournament Calculator ===');
    console.log('Tournament data loaded successfully!');
    console.log('\nAvailable queries:');
    console.log('  Score Match <id>       - Show match result');
    console.log('  Games Player <name>    - Show games won/lost for player');
    console.log('\nPress Enter (empty line) to exit.\n');

    const processInput = () => {
      this.rl!.question('> ', (query) => {
        if (query.trim() === '') {
          console.log('Goodbye!');
          this.rl!.close();
          return;
        }

        try {
          this.processQuery(query);
        } catch (error) {
          console.error(
            'Error:',
            error instanceof Error ? error.message : 'Unknown error'
          );
        }

        processInput();
      });
    };

    processInput();
  }

  public cleanup(): void {
    if (this.rl) {
      this.rl.close();
      this.rl = undefined;
    }
  }

  private showHelp(): void {
    console.log('Tennis Tournament Calculator');
    console.log('Usage: node index.js <tournament-file>');
    console.log('Example: node index.js full_tournament.txt');
    console.log('');
    console.log('Available queries:');
    console.log('  Score Match <id>       - Show match result');
    console.log('  Games Player <name>    - Show games won/lost for player');
  }

  private validateDataLoaded(): void {
    if (!this.isDataLoaded) {
      throw new Error(
        'No tournament data loaded. Please load a tournament file first.'
      );
    }
  }
}
