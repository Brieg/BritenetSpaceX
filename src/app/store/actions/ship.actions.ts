import { Action } from '@ngrx/store';
import { IShip } from '../../interfaces/ships';

export enum ShipActionsTypes {
  Load = '[SHIP] LOAD',
  LoadSuccess = '[SHIP] LOAD SUCCESS',
  LoadError = '[SHIP] LOAD ERROR',
}

export class LoadShip implements Action {
  readonly type = ShipActionsTypes.Load;
}

export class LoadShipSuccess implements Action {
  readonly type = ShipActionsTypes.LoadSuccess;
  constructor(public payload: { entities: IShip[] }) {}
}

export class LoadShipError implements Action {
  readonly type = ShipActionsTypes.LoadError;
  constructor(public error: any) {}
}

export type ShipActionsUnion = LoadShip | LoadShipSuccess | LoadShipError;
