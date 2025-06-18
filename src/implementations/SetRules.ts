import { ISetRules } from '../interfaces/SetInfo';

/**
 * This class implements the rules for a set.
 * The first player to win 6 games wins the set and do not need to be ahead by 2 games.
 */
export class SetRules implements ISetRules {
  private static readonly GAMES_TO_WIN = 6;

  isSetFinished(score1: number, score2: number): boolean {
    return score1 === SetRules.GAMES_TO_WIN || score2 === SetRules.GAMES_TO_WIN;
  }

  getWinner(score1: number, score2: number): 'player1' | 'player2' {
    return score1 > score2 ? 'player1' : 'player2';
  }
}
