import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { IShip } from '../../interfaces/ships';
import { ShipActionsTypes, ShipsActionsUnion } from '../actions/ships.actions';

export interface loadableShips extends Loadable {
  entities: IShip[];
}

export function createDefaultShip(): loadableShips {
  return {
    ...createDefaultLoadable(),
    entities: [],
  };
}

function baseShipReducer(state: loadableShips = createDefaultShip(), action: ShipsActionsUnion): loadableShips {
  switch (action.type) {
    case ShipActionsTypes.LoadSuccess:
      return {
        ...state,
        entities: action.payload.entities,
      };
    default:
      return state;
  }
}

export function shipReducer(state: loadableShips, action: ShipsActionsUnion): loadableShips {
  return withLoadable(baseShipReducer, {
    loadingActionType: ShipActionsTypes.Load,
    successActionType: ShipActionsTypes.LoadSuccess,
    errorActionType: ShipActionsTypes.LoadError,
  })(state, action);
}
