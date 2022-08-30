import { initialLaunchState, LaunchState } from '../store/states/launch.state';
import * as launchActions from '../store/actions/launch.actions';
import { Action, createReducer, on } from '@ngrx/store';

const launchReducer = createReducer(
  initialLaunchState,
  on(launchActions.Init, (state) => ({ ...state, loaded: false, error: null })),
  on(launchActions.LoadLaunch, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(launchActions.LoadLaunchSuccess, (state, { data }) => ({
    ...state,
    launch: data,
    loaded: true,
    error: null,
  })),
  on(launchActions.LoadLaunchFailure, (state, { error }) => ({ ...state, error }))
);

export function lReducer(state: LaunchState | undefined, action: Action) {
  return launchReducer(state, action);
}
