import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { LaunchesActionsTypes, LaunchesActionsUnion } from '../actions/launches.actions';
import { ILaunches } from '../../interfaces/launches';

export interface LoadableLaunches extends Loadable {
  entities: ILaunches[];
}

export function createDefaultLaunch(): LoadableLaunches {
  return {
    ...createDefaultLoadable(),
    entities: [],
  };
}

function baseLaunchReducer(
  state: LoadableLaunches = createDefaultLaunch(),
  action: LaunchesActionsUnion
): LoadableLaunches {
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

export function launchReducer(state: LoadableLaunches, action: LaunchesActionsUnion): LoadableLaunches {
  return withLoadable(baseLaunchReducer, {
    loadingActionType: LaunchesActionsTypes.Load,
    successActionType: LaunchesActionsTypes.LoadSuccess,
    errorActionType: LaunchesActionsTypes.LoadError,
  })(state, action);
}
