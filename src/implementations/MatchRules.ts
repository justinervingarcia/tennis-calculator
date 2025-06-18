import { IMatchRules } from '../interfaces/MatchInfo';

/**
 * This class implements the rules for a match.
 * The first player to win 2 sets wins the match.
 */
export class MatchRules implements IMatchRules {
  private static readonly SETS_TO_WIN: number = 2;

  isMatchFinished(player1SetWins: number, player2SetWins: number): boolean {
    return (
      player1SetWins >= MatchRules.SETS_TO_WIN ||
      player2SetWins >= MatchRules.SETS_TO_WIN
    );
  }

  getWinner(
    player1SetWins: number,
    player2SetWins: number
  ): 'player1' | 'player2' {
    return player1SetWins > player2SetWins ? 'player1' : 'player2';
  }
}
