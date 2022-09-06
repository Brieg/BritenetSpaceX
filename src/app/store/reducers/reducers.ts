import { ActionReducerMap } from '@ngrx/store';
import { LoadableLaunches, launchReducer } from './launches.reducers';
import { loadableShips, shipReducer } from './ships.reducers';
import { launchOneReducer } from './launch.reducers';

interface AppState {
  launch: LoadableLaunches;
  launches: LoadableLaunches;
  ship: loadableShips;
}

export const reducers: ActionReducerMap<AppState> = {
  // @ts-ignore
  launch: launchOneReducer,
  // @ts-ignore
  launches: launchReducer,
  // @ts-ignore
  ship: shipReducer,
};
