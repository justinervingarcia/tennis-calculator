import { ISetResult } from './interfaces/SetInfo';
import { IPlayerInfo } from './interfaces/PlayerInfo';
import { IMatchRules } from './interfaces/MatchInfo';

export class Match {
  private sets: ISetResult[] = [];
  private player1MatchScore: number = 0;
  private player2MatchScore: number = 0;

  constructor(
    private readonly matchNo: string,
    public readonly player1: IPlayerInfo,
    public readonly player2: IPlayerInfo,
    private readonly matchRules: IMatchRules
  ) {}

  /**
   * Get the match number
   * @returns the match number
   */
  public getMatchNumber(): string {
    return this.matchNo;
  }

  /**
   * Get the sets
   * @returns the sets
   */
  public getSets(): ISetResult[] {
    return [...this.sets];
  }

  /**
   * Check if the match is over
   * @returns true if the match is over, false otherwise
   */
  public isMatchEnd(): boolean {
    return this.matchRules.isMatchFinished(
      this.player1MatchScore,
      this.player2MatchScore
    );
  }

  /**
   * Add a won set
   * @param set the set to add
   */
  public addWonSet(set: ISetResult): void {
    if (this.isMatchEnd()) return;

    if (!set.isFinished()) return;

    this.sets.push(set);

    if (set.getWinner() === this.player1) this.player1MatchScore++;
    else this.player2MatchScore++;
  }

  /**
   * Get the match score
   * @returns the match score
   */
  public getMatchScore(): string {
    const winnerFirst = this.isMatchEnd();
    if (winnerFirst) {
      return this.getWinnerFirstScore();
    }
    return this.getCurrentScore();
  }

  private getCurrentScore(): string {
    return `${this.player1MatchScore} sets to ${this.player2MatchScore}`;
  }

  private getWinnerFirstScore(): string {
    const winner = this.matchRules.getWinner(
      this.player1MatchScore,
      this.player2MatchScore
    );
    return winner === 'player1'
      ? this.getCurrentScore()
      : `${this.player2MatchScore} sets to ${this.player1MatchScore}`;
  }

  /**
   * Get the match winner
   * @returns the match winner
   */
  public getMatchWinner(): string | null {
    if (!this.isMatchEnd()) return null;

    const winner = this.matchRules.getWinner(
      this.player1MatchScore,
      this.player2MatchScore
    );

    const winningPlayer = winner === 'player1' ? this.player1 : this.player2;
    const losingPlayer = winner === 'player1' ? this.player2 : this.player1;

    return `${winningPlayer.name} defeated ${losingPlayer.name}`;
  }
}
