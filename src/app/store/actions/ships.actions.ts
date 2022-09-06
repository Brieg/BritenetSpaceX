import { Action } from '@ngrx/store';
import { IShip } from '../../interfaces/ships';

export enum ShipsActionsTypes {
  Load = '[SHIPS] LOAD',
  LoadSuccess = '[SHIPS] LOAD SUCCESS',
  LoadError = '[SHIPS] LOAD ERROR',
}

export class LoadShips implements Action {
  readonly type = ShipsActionsTypes.Load;
}

export class LoadShipsSuccess implements Action {
  readonly type = ShipsActionsTypes.LoadSuccess;
  constructor(public payload: { entities: IShip[] }) {}
}

export class LoadShipsError implements Action {
  readonly type = ShipsActionsTypes.LoadError;
  constructor(public error: any) {}
}

export type ShipsActionsUnion = LoadShips | LoadShipsSuccess | LoadShipsError;
