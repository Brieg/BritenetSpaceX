import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { IShip } from '../../interfaces/ships';
import { ShipsActionsTypes, ShipsActionsUnion } from '../actions/ships.actions';

export interface loadableShips extends Loadable {
  entities: IShip[];
}

export function createDefaultShips(): loadableShips {
  return {
    ...createDefaultLoadable(),
    entities: [],
  };
}

function baseShipsReducer(state: loadableShips = createDefaultShips(), action: ShipsActionsUnion): loadableShips {
  switch (action.type) {
    case ShipsActionsTypes.LoadSuccess:
      return {
        ...state,
        entities: action.payload.entities,
      };
    default:
      return state;
  }
}

export function shipsReducer(state: loadableShips, action: ShipsActionsUnion): loadableShips {
  return withLoadable(baseShipsReducer, {
    loadingActionType: ShipsActionsTypes.Load,
    successActionType: ShipsActionsTypes.LoadSuccess,
    errorActionType: ShipsActionsTypes.LoadError,
  })(state, action);
}
