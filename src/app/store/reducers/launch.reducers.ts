import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { ILaunches } from '../../interfaces/launches';
import { LaunchOneActionsTypes, LaunchActionsUnion } from '../actions/launch.actions';

export interface LoadableLaunch extends Loadable {
  entities: ILaunches;
}

export function createDefaultLaunch(): LoadableLaunch {
  return <LoadableLaunch>{
    ...createDefaultLoadable(),
    entities: {},
  };
}

function baseLaunchReducer(state: LoadableLaunch = createDefaultLaunch(), action: LaunchActionsUnion): LoadableLaunch {
  switch (action.type) {
    case LaunchOneActionsTypes.LoadSuccess:
      return {
        ...state,
        // @ts-ignore
        entities: action.payload.entities,
      };
    default:
      return state;
  }
}

export function launchOneReducer(state: LoadableLaunch, action: LaunchActionsUnion): LoadableLaunch {
  return withLoadable(baseLaunchReducer, {
    loadingActionType: LaunchOneActionsTypes.Load,
    successActionType: LaunchOneActionsTypes.LoadSuccess,
    errorActionType: LaunchOneActionsTypes.LoadError,
  })(state, action);
}
