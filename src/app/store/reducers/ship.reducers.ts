import { createDefaultLoadable, Loadable } from '../loadable/loadable';
import { withLoadable } from '../loadable/with-loadable';
import { IShip } from '../../interfaces/ships';
import { ShipActionsTypes, ShipActionsUnion } from '../actions/ship.actions';

export interface loadableShip extends Loadable {
  entities: IShip;
}

export function createDefaultShip(): loadableShip {
  return <loadableShip>{
    ...createDefaultLoadable(),
    entities: {},
  };
}

function baseShipReducer(state: loadableShip = createDefaultShip(), action: ShipActionsUnion): loadableShip {
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

export function shipReducer(state: loadableShip, action: ShipActionsUnion): loadableShip {
  return withLoadable(baseShipReducer, {
    loadingActionType: ShipActionsTypes.Load,
    successActionType: ShipActionsTypes.LoadSuccess,
    errorActionType: ShipActionsTypes.LoadError,
  })(state, action);
}
