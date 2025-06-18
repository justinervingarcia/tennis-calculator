import { Game } from './Game';
import { IPlayerInfo } from './interfaces/PlayerInfo';

/**
 * Handles the parsing of point sequences into individual games
 */
export class GameSequenceParser {
  /**
   * Parse a sequence of points into completed games
   * @param pointSequence Array of point values (0 for player1, 1 for player2)
   * @param player1 First player information
   * @param player2 Second player information
   * @returns Array of completed games
   */
  parseGames(
    pointSequence: number[],
    player1: IPlayerInfo,
    player2: IPlayerInfo
  ): Game[] {
    const games: Game[] = [];
    let currentGame = new Game(player1, player2);

    for (const point of pointSequence) {
      this.scorePoint(currentGame, point);

      if (currentGame.isOver()) {
        games.push(currentGame);
        currentGame = new Game(player1, player2);
      }
    }

    if (this.hasGameInProgress(currentGame)) {
      games.push(currentGame);
    }

    return games;
  }

  private scorePoint(game: Game, point: number): void {
    if (point === 0) {
      game.player1Scores();
    } else {
      game.player2Scores();
    }
  }

  private hasGameInProgress(game: Game): boolean {
    return game.getPlayer1Score() > 0 || game.getPlayer2Score() > 0;
  }
}
