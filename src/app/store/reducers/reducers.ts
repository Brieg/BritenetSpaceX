import { ActionReducerMap } from '@ngrx/store';
import { doubleLoadLaunches, launchReducer } from './launch.reducers';
import { doubleLoadShips, shipReducer } from './ship.reducers';

interface AppState {
  launch: doubleLoadLaunches;
  ship: doubleLoadShips;
}

export const reducers: ActionReducerMap<AppState> = {
  // @ts-ignore
  launch: launchReducer,
  // @ts-ignore
  ship: shipReducer,
};
