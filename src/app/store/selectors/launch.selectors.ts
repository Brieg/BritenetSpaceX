import { LaunchState, LAUNCH_FEATURE_KEY } from '../states/launch.state';
import { createFeatureSelector, createSelector, State } from '@ngrx/store';

export const getLaunchesState = createFeatureSelector<LaunchState>(LAUNCH_FEATURE_KEY);

export const getLaunchesLoaded = createSelector(getLaunchesState, (state: LaunchState) => state.loaded);

export const getLaunchesError = createSelector(getLaunchesState, (state: LaunchState) => state.error);

export const getAllLaunches = createSelector(getLaunchesState, (state: LaunchState) => state.launch);
