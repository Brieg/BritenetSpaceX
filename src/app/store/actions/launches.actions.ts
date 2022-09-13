import { Action } from '@ngrx/store';
import { ILaunches } from '../../interfaces/launches';

export enum LaunchesActionsTypes {
  Load = '[LAUNCHES] LOAD',
  LoadSuccess = '[LAUNCHES] LOAD SUCCESS',
  LoadError = '[LAUNCH] LOAD ERROR',
}

export class LoadLaunches implements Action {
  readonly type = LaunchesActionsTypes.Load;
}

export class LoadLaunchesSuccess implements Action {
  readonly type = LaunchesActionsTypes.LoadSuccess;
  constructor(readonly payload: { entities: ILaunches[] }) {}
}

export class LoadLaunchesError implements Action {
  readonly type = LaunchesActionsTypes.LoadError;
  constructor(public error: any) {}
}

export type LaunchesActionsUnion = LoadLaunches | LoadLaunchesSuccess | LoadLaunchesError;
