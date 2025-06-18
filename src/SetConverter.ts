import { Game } from './Game';
import { Set } from './Set';
import { SetRules } from './implementations/SetRules';
import { IPlayerInfo } from './interfaces/PlayerInfo';

/**
 * Handles the conversion of games into sets
 */
export class SetConverter {
  /**
   * Convert a sequence of games into sets
   * @param games Array of completed games
   * @param player1 First player information
   * @param player2 Second player information
   * @returns Array of sets
   */
  convertGamesToSets(
    games: Game[],
    player1: IPlayerInfo,
    player2: IPlayerInfo
  ): Set[] {
    const sets: Set[] = [];
    let currentSet = new Set(player1, player2, new SetRules());

    for (const game of games) {
      currentSet.addWonGame(game);

      if (currentSet.isFinished()) {
        sets.push(currentSet);
        currentSet = new Set(player1, player2, new SetRules());
      }
    }

    if (this.hasSetInProgress(currentSet)) {
      sets.push(currentSet);
    }

    return sets;
  }

  private hasSetInProgress(set: Set): boolean {
    return set.getGames().length > 0;
  }
}
