import { Action } from '@ngrx/store';
import { ILaunches } from '../../interfaces/launches';

export enum LaunchOneActionsTypes {
  Load = '[LAUNCH] LOAD',
  LoadSuccess = '[LAUNCH] LOADED LAUNCH',
  LoadError = '[LAUNCH] LOAD ERROR',
}

export class LoadLaunch implements Action {
  readonly type = LaunchOneActionsTypes.Load;
  constructor(readonly payload: { parameters: number }) {}
}

export class LoadLaunchSuccess implements Action {
  readonly type = LaunchOneActionsTypes.LoadSuccess;
  constructor(readonly payload: { entities?: ILaunches }) {}
}

export class LoadLaunchError implements Action {
  readonly type = LaunchOneActionsTypes.LoadError;
  constructor(public error: any) {}
}

export type LaunchActionsUnion = LoadLaunch | LoadLaunchSuccess | LoadLaunchError;
