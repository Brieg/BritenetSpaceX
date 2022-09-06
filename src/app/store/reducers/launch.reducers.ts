import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { LaunchActionsTypes, LaunchActionsUnion } from '../actions/launch.actions';
import { ILaunches } from '../../interfaces/launches';

export interface doubleLoadLaunches extends Loadable {
  entities: ILaunches[];
}

export function createDefaultLaunch(): doubleLoadLaunches {
  return {
    ...createDefaultLoadable(),
    entities: [],
  };
}

function baseLaunchReducer(
  state: doubleLoadLaunches = createDefaultLaunch(),
  action: LaunchActionsUnion
): doubleLoadLaunches {
  switch (action.type) {
    case LaunchActionsTypes.LoadSuccess:
      return {
        ...state,
        entities: action.payload.entities,
      };
    default:
      return state;
  }
}

export function launchReducer(state: doubleLoadLaunches, action: LaunchActionsUnion): doubleLoadLaunches {
  return withLoadable(baseLaunchReducer, {
    loadingActionType: LaunchActionsTypes.Load,
    successActionType: LaunchActionsTypes.LoadSuccess,
    errorActionType: LaunchActionsTypes.LoadError,
  })(state, action);
}
