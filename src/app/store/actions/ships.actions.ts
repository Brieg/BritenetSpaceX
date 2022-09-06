import { Action } from '@ngrx/store';
import { IShip } from '../../interfaces/ships';

export enum ShipActionsTypes {
  Load = '[SHIPS] LOAD',
  LoadSuccess = '[SHIPS] LOAD SUCCESS',
  LoadError = '[SHIPS] LOAD ERROR',
}

export class LoadShips implements Action {
  readonly type = ShipActionsTypes.Load;
}

export class LoadShipsSuccess implements Action {
  readonly type = ShipActionsTypes.LoadSuccess;
  constructor(public payload: { entities: IShip[] }) {}
}

export class LoadShipsError implements Action {
  readonly type = ShipActionsTypes.LoadError;
  constructor(public error: any) {}
}

export type ShipsActionsUnion = LoadShips | LoadShipsSuccess | LoadShipsError;
