import { createAction, props } from '@ngrx/store';
import { ILaunches } from '../../interfaces/launches';

export enum LaunchActionsNames {
  Init = '[Launch] Init',
  LoadLaunch = '[Launch] Load Launches',
  LoadLaunchSuccess = '[Launch] Load Launches Success',
  LoadLaunchFailure = '[Launch] Load Launches Failure',
  GetRandomLaunch = '[Launch] Get Random Launches',
  GetRandomLaunchSuccess = '[Launch] Get Random Launches Success',
  GetRandomLaunchFailure = '[Launch] Get Random Launches Failure',
}

export const Init = createAction(LaunchActionsNames.Init);

export const LoadLaunch = createAction(LaunchActionsNames.LoadLaunch);

export const LoadLaunchSuccess = createAction(LaunchActionsNames.LoadLaunchSuccess, props<{ data: ILaunches[] }>());

export const LoadLaunchFailure = createAction(LaunchActionsNames.LoadLaunchFailure, props<{ error: string | null }>());

export const GetRandomLaunch = createAction(LaunchActionsNames.GetRandomLaunch);

export const GetRandomLaunchSuccess = createAction(
  LaunchActionsNames.GetRandomLaunchSuccess,
  props<{ data: ILaunches[] }>()
);

export const GetRandomLaunchFailure = createAction(
  LaunchActionsNames.GetRandomLaunchFailure,
  props<{ error: string | null }>()
);
