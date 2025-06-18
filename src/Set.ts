import { ISetRules } from './interfaces/SetInfo';
import { IPlayerInfo } from './interfaces/PlayerInfo';
import { IGameResult } from './interfaces/GameInfo';

export class Set {
  private player1SetScore: number = 0;
  private player2SetScore: number = 0;
  private games: IGameResult[] = [];

  constructor(
    public readonly player1: IPlayerInfo,
    public readonly player2: IPlayerInfo,
    private readonly setRules: ISetRules
  ) {}

  /**
   * Get the set score
   * @returns the set score
   */
  public getSetScore(): string {
    return `${this.player1SetScore} - ${this.player2SetScore}`;
  }

  /**
   * Add a won game
   * @param game the game to add
   */
  public addWonGame(game: IGameResult): void {
    if (this.isFinished()) return;
    this.games.push(game);
    this.updateScoreForGame(game);
  }

  /**
   * Check if the set is finished
   * @returns true if the set is finished, false otherwise
   */
  public isFinished(): boolean {
    return this.setRules.isSetFinished(
      this.player1SetScore,
      this.player2SetScore
    );
  }

  /**
   * Get the games
   * @returns the games
   */
  public getGames(): IGameResult[] {
    return [...this.games];
  }

  /**
   * Get the winner of the set
   * @returns the winner of the set
   */
  public getWinner(): IPlayerInfo | null {
    if (!this.isFinished()) return null;

    const winner = this.setRules.getWinner(
      this.player1SetScore,
      this.player2SetScore
    );

    return winner === 'player1' ? this.player1 : this.player2;
  }

  private updateScoreForGame(game: IGameResult): void {
    if (game.getWinner() === this.player1.name) {
      this.player1SetScore++;
    } else {
      this.player2SetScore++;
    }
  }
}
