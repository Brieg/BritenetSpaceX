import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { ILaunches } from '../../interfaces/launches';
import { LaunchActionsTypes, LaunchActionsUnion } from '../actions/launch.actions';

export interface loadableLaunch extends Loadable {
  entities: ILaunches;
}

export function createDefaultLaunch(): loadableLaunch {
  return <loadableLaunch>{
    ...createDefaultLoadable(),
    entities: {},
  };
}

function baseLaunchReducer(state: loadableLaunch = createDefaultLaunch(), action: LaunchActionsUnion): loadableLaunch {
  switch (action.type) {
    case LaunchActionsTypes.LoadSuccess:
      return {
        ...state,
        // @ts-ignore
        entities: action.payload.entities,
      };
    default:
      return state;
  }
}

export function launchReducer(state: loadableLaunch, action: LaunchActionsUnion): loadableLaunch {
  return withLoadable(baseLaunchReducer, {
    loadingActionType: LaunchActionsTypes.Load,
    successActionType: LaunchActionsTypes.LoadSuccess,
    errorActionType: LaunchActionsTypes.LoadError,
  })(state, action);
}
