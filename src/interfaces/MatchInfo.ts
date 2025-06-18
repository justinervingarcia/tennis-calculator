export interface IMatchRules {
  isMatchFinished(player1SetWins: number, player2SetWins: number): boolean;
  getWinner(
    player1SetWins: number,
    player2SetWins: number
  ): 'player1' | 'player2';
}
