export class Player {
  private wins: number = 0;
  private losses: number = 0;

  constructor(public name: string) {}

  public getWins(): number {
    return this.wins;
  }

  public getLosses(): number {
    return this.losses;
  }

  public addWin(): void {
    this.wins++;
  }

  public addLoss(): void {
    this.losses++;
  }
}
