import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { ILaunches } from '../../interfaces/launches';
import { LaunchOneActionsTypes, LaunchOneActionsUnion } from '../actions/oneLaunch.actions';

export interface doubleOneLoadLaunches extends Loadable {
  entities: ILaunches;
}

export function createDefaultLaunch(): doubleOneLoadLaunches {
  return <doubleOneLoadLaunches>{
    ...createDefaultLoadable(),
    entities: {},
  };
}

function baseLaunchReducer(
  state: doubleOneLoadLaunches = createDefaultLaunch(),
  action: LaunchOneActionsUnion
): doubleOneLoadLaunches {
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

export function launchOneReducer(state: doubleOneLoadLaunches, action: LaunchOneActionsUnion): doubleOneLoadLaunches {
  return withLoadable(baseLaunchReducer, {
    loadingActionType: LaunchOneActionsTypes.Load,
    successActionType: LaunchOneActionsTypes.LoadSuccess,
    errorActionType: LaunchOneActionsTypes.LoadError,
  })(state, action);
}
