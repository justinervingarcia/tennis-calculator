import { IPlayerInfo } from './PlayerInfo';
import { IGameResult } from './GameInfo';

export interface ISetRules {
  isSetFinished(score1: number, score2: number): boolean;
  getWinner(score1: number, score2: number): 'player1' | 'player2';
}

export interface ISetResult {
  getWinner(): IPlayerInfo | null;
  isFinished(): boolean;
  getGames(): IGameResult[];
}
