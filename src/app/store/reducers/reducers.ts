import { ActionReducerMap } from '@ngrx/store';
import { loadableLaunches, launchesReducer } from './launches.reducers';
import { loadableShips, shipsReducer } from './ships.reducers';
import { loadableLaunch, launchReducer } from './launch.reducers';
import { loadableShip, shipReducer } from './ship.reducers';

interface AppState {
  launch: loadableLaunch;
  launches: loadableLaunches;
  ship: loadableShip;
  ships: loadableShips;
}

export const reducers: ActionReducerMap<AppState> = {
  // @ts-ignore
  launch: launchReducer,
  // @ts-ignore
  launches: launchesReducer,
  // @ts-ignore
  ship: shipReducer,
  // @ts-ignore
  ships: shipsReducer,
};
