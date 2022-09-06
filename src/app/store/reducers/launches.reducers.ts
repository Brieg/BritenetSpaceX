import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { LaunchesActionsTypes, LaunchesActionsUnion } from '../actions/launches.actions';
import { ILaunches } from '../../interfaces/launches';

export interface loadableLaunches extends Loadable {
  entities: ILaunches[];
}

export function createDefaultLaunch(): loadableLaunches {
  return {
    ...createDefaultLoadable(),
    entities: [],
  };
}

function baseLaunchesReducer(
  state: loadableLaunches = createDefaultLaunch(),
  action: LaunchesActionsUnion
): loadableLaunches {
  switch (action.type) {
    case LaunchesActionsTypes.LoadSuccess:
      return {
        ...state,
        entities: action.payload.entities,
      };
    default:
      return state;
  }
}

export function launchesReducer(state: loadableLaunches, action: LaunchesActionsUnion): loadableLaunches {
  return withLoadable(baseLaunchesReducer, {
    loadingActionType: LaunchesActionsTypes.Load,
    successActionType: LaunchesActionsTypes.LoadSuccess,
    errorActionType: LaunchesActionsTypes.LoadError,
  })(state, action);
}
