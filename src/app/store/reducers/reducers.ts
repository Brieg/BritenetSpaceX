import { ActionReducerMap } from '@ngrx/store';
import { doubleLoadLaunches, launchReducer } from './launch.reducers';
import { doubleLoadShips, shipReducer } from './ship.reducers';
import { launchOneReducer } from './onelaunch.reducers';

interface AppState {
  launch: doubleLoadLaunches;
  launches: doubleLoadLaunches;
  ship: doubleLoadShips;
}

export const reducers: ActionReducerMap<AppState> = {
  // @ts-ignore
  launch: launchOneReducer,
  // @ts-ignore
  launches: launchReducer,
  // @ts-ignore
  ship: shipReducer,
};
