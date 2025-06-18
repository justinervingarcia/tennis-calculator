import { IPlayerInfo } from './interfaces/PlayerInfo';

export class Game {
  private player1Score: number = 0;
  private player2Score: number = 0;

  private static readonly MIN_POINTS_TO_WIN = 4;
  private static readonly MIN_LEAD_TO_WIN = 2;
  private static readonly DEUCE_THRESHOLD = 3;

  constructor(
    public player1: IPlayerInfo,
    public player2: IPlayerInfo
  ) {}

  public getPlayer1Score(): number {
    return this.player1Score;
  }

  public getPlayer2Score(): number {
    return this.player2Score;
  }

  public player1Scores(): void {
    if (this.isOver()) {
      return;
    }
    this.player1Score++;
  }

  public player2Scores(): void {
    if (this.isOver()) {
      return;
    }
    this.player2Score++;
  }

  /**
   * Check if the game is over
   * @returns true if the game is over, false otherwise
   */
  public isOver(): boolean {
    const diff = this.getMatchDiff();
    return (
      (this.player1Score >= Game.MIN_POINTS_TO_WIN ||
        this.player2Score >= Game.MIN_POINTS_TO_WIN) &&
      diff >= Game.MIN_LEAD_TO_WIN
    );
  }

  /**
   * Get the difference between the player scores
   * @returns the difference between the player scores
   */
  private getMatchDiff(): number {
    return Math.abs(this.player1Score - this.player2Score);
  }

  /**
   * Get the call for a given point
   * @param point the point to get the call for
   * @returns the call for the given point
   */
  public getCall(point: number): string {
    switch (point) {
      case 0:
        return '0';
      case 1:
        return '15';
      case 2:
        return '30';
      case 3:
        return '40';
      default:
        return 'Game';
    }
  }

  /**
   * Get the current score
   * @returns the current score
   */
  public getCurrentScore(): string {
    if (this.isOver()) {
      return `Game`;
    }

    if (this.isDeuce()) {
      return 'Deuce';
    }

    if (this.isAdvantage()) {
      return `Advantage Player ${this.getAdvantagePlayer()}`;
    }

    return this.getRegularScoreDisplay();
  }

  /**
   * Check if the game is in deuce
   * @returns true if the game is in deuce, false otherwise
   */
  private isDeuce(): boolean {
    return (
      this.player1Score === this.player2Score &&
      this.player1Score >= Game.DEUCE_THRESHOLD
    );
  }

  /**
   * Check if the game is in advantage
   * @returns true if the game is in advantage, false otherwise
   */
  private isAdvantage(): boolean {
    return (
      this.player1Score >= Game.DEUCE_THRESHOLD &&
      this.player2Score >= Game.DEUCE_THRESHOLD &&
      this.getMatchDiff() === 1
    );
  }

  /**
   * Get the player in advantage
   * @returns the player in advantage
   */
  private getAdvantagePlayer(): string {
    return this.player1Score > this.player2Score
      ? this.player1.name
      : this.player2.name;
  }

  /**
   * Get the regular score display
   * @returns the regular score display
   */
  private getRegularScoreDisplay(): string {
    return `${this.getCall(this.player1Score)} - ${this.getCall(this.player2Score)}`;
  }

  /**
   * Get the winner of the game
   * @returns the winner of the game
   */
  public getWinner(): string | null {
    if (!this.isOver()) return null;

    return this.player1Score > this.player2Score
      ? this.player1.name
      : this.player2.name;
  }
}
